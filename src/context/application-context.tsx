
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import type { PersonalInfoFormValues } from '@/components/forms/personal-info-form';
import type { AcademicsFormValues } from '@/components/forms/academics-form';
import type { LanguageFormValues } from '@/components/forms/language-form';
import type { FinancesFormValues } from '@/components/forms/finances-form';
import type { StudyPlanFormValues } from '@/components/forms/study-plan-form';
import type { FamilyFormValues } from '@/components/forms/family-form';
import type { BackgroundFormValues } from '@/components/forms/background-form';
import { useAuth } from './auth-context';
import type { College } from '@/lib/college-data';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';

export interface UploadedFile {
    url: string;
    fileName: string;
    date: string; // ISO date string
    path: string;
}

export interface DocumentStatus {
    status: 'Uploaded' | 'Pending' | 'Action Required';
    files: UploadedFile[];
    message?: string;
}

interface DocumentsData {
  [key: string]: DocumentStatus;
}

export const documentList = [
    // Core
    { id: 'passport', name: 'Passport Bio Page', description: "A clear, full-color scan of your passport's photo page.", category: 'Core' },
    { id: 'loa', name: 'Letter of Acceptance (LOA)', description: 'The official acceptance letter from your DLI.', category: 'Core' },
    { id: 'proofOfFunds', name: 'Proof of Funds', description: 'Bank statements, GIC certificate, or loan approval letters.', category: 'Core' },
    { id: 'languageTest', name: 'Language Test Results', description: 'Your official IELTS, TOEFL, PTE, or other test score report.', category: 'Core' },
    { id: 'sop', name: 'Statement of Purpose (SOP/LOE)', description: 'Your letter explaining your study plans and goals.', category: 'Core' },
    { id: 'photo', name: 'Digital Photo', description: 'A recent passport-style photo with a white background.', category: 'Core' },
    { id: 'educationDocs', name: 'Previous Education Documents', description: 'Degree/diploma certificates and transcripts.', category: 'Core' },
    // Situational & Recommended
    { id: 'custodian', name: 'Custodian Declaration (for minors)', description: 'Required if the applicant is under 18.', category: 'Situational' },
    { id: 'tiesToHome', name: 'Ties to Home Country', description: 'Property docs, job offers, family business ownership.', category: 'Situational' },
    { id: 'resume', name: 'Resume / CV', description: 'Helpful for mature students or post-graduate applicants.', category: 'Situational' },
    { id: 'travelHistory', name: 'Travel History', description: 'Copies of previous visas/stamps to show travel profile.', category: 'Situational' },
    { id: 'explanationLetter', name: 'Letter of Explanation for Gaps/Refusals', description: 'Explain any study/work gaps or previous visa refusals.', category: 'Situational' },
    { id: 'sponsorship', name: 'Sponsorship Letter & Documents', description: "If a third-party is funding your studies.", category: 'Situational' },
    { id: 'medical', name: 'Medical Exam (eMedical Sheet)', description: 'Required if staying 6+ months or from a designated country.', category: 'Situational' },
    { id: 'pcc', name: 'Police Clearance Certificate (PCC)', description: 'Recommended for applicants over 18.', category: 'Situational' },
    { id: 'marriageCert', name: 'Marriage Certificate', description: 'Required only if your spouse is coming with you.', category: 'Situational' },
    { id: 'eca', name: 'Educational Credential Assessment (ECA)', description: 'Required for credentials obtained outside of Canada.', category: 'Situational' },
];

// Define types for all form sections.
interface ApplicationData {
  status: 'draft' | 'submitted';
  submittedAppId?: string; // ID of the corresponding document in the top-level 'applications' collection
  selectedCollege: College | null;
  personalInfo: Partial<PersonalInfoFormValues>;
  academics: Partial<AcademicsFormValues>;
  language: Partial<LanguageFormValues>;
  finances: Partial<FinancesFormValues>;
  studyPlan: Partial<StudyPlanFormValues>;
  family: Partial<FamilyFormValues>;
  background: Partial<BackgroundFormValues>;
  documents: DocumentsData;
}

interface ApplicationContextType {
  applicationData: ApplicationData;
  updateStepData: (step: keyof Omit<ApplicationData, 'selectedCollege'>, data: any) => Promise<void>;
  updateCollegeAndProgram: (college: College, program: string) => Promise<void>;
  resetApplicationData: () => Promise<void>;
  isLoaded: boolean;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

// Define initial empty state for the application data
const initialApplicationData: ApplicationData = {
   status: 'draft',
   selectedCollege: null,
   personalInfo: {},
   academics: { educationHistory: [], employmentHistory: [] },
   language: { testTaken: 'none' },
   finances: { fundingSources: [], proofType: [] },
   studyPlan: {},
   family: { children: [] },
   background: { certification: false },
   documents: {},
};

// FIX: Add a recursive function to convert Firestore Timestamps to JS Dates
function convertTimestampsToDates(data: any): any {
    if (!data) return data;
    if (data.toDate && typeof data.toDate === 'function') {
        return data.toDate();
    }
    if (Array.isArray(data)) {
        return data.map(item => convertTimestampsToDates(item));
    }
    if (typeof data === 'object') {
        const res: { [key: string]: any } = {};
        for (const key in data) {
            res[key] = convertTimestampsToDates(data[key]);
        }
        return res;
    }
    return data;
}

export const ApplicationProvider = ({ children }: { children: ReactNode }) => {
  const [applicationData, setApplicationData] = useState<ApplicationData>(initialApplicationData);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) {
      setIsLoaded(false);
      return;
    }

    if (user?.uid) {
      const docRef = doc(db, 'users', user.uid, 'application', 'draft');
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const dataFromDb = docSnap.data();
          // FIX: Use the conversion function here
          const convertedData = convertTimestampsToDates(dataFromDb);
          setApplicationData(convertedData as ApplicationData);
        } else {
          setApplicationData(initialApplicationData);
        }
        setIsLoaded(true);
      }, (error) => {
        console.error("Error listening to application draft:", error);
        setIsLoaded(true);
      });

      return () => unsubscribe();
    } else {
      setApplicationData(initialApplicationData);
      setIsLoaded(false);
    }
  }, [user, authLoading]);

  const updateStepData = useCallback(async (step: keyof Omit<ApplicationData, 'selectedCollege'>, data: any) => {
    if (!user?.uid) return;

    // Optimistic UI update
    setApplicationData(prevData => ({ ...prevData, [step]: data }));

    const docRef = doc(db, 'users', user.uid, 'application', 'draft');
    try {
      // Add updatedAt timestamp to track changes for drafts
      const sanitized = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
      await setDoc(docRef, { [step]: sanitized, updatedAt: serverTimestamp() }, { merge: true });
    } catch (error) {
      console.error("Error updating application step data:", error);
      // Optional: Revert state on failure by refetching or storing old state.
    }
  }, [user]);

  const updateCollegeAndProgram = useCallback(async (college: College, program: string) => {
    if (!user?.uid) return;
    
    let newStudyPlanForDb: Partial<StudyPlanFormValues>;

    // Optimistic UI update using functional form to avoid stale state
    setApplicationData(prevData => {
      const newStudyPlan = { ...prevData.studyPlan, programChoice: program };
      newStudyPlanForDb = newStudyPlan; // capture the new state for db write
      return {
          ...prevData,
          selectedCollege: college,
          studyPlan: newStudyPlan,
      };
    });

    const docRef = doc(db, 'users', user.uid, 'application', 'draft');
    try {
      await setDoc(docRef, {
        selectedCollege: college,
        studyPlan: newStudyPlanForDb!,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error("Error updating college/program:", error);
    }
  }, [user]);

  const resetApplicationData = useCallback(async () => {
    if (!user?.uid) return;
    
    // Optimistic UI update
    setApplicationData(initialApplicationData);

    const docRef = doc(db, 'users', user.uid, 'application', 'draft');
    try {
      await setDoc(docRef, { ...initialApplicationData, updatedAt: serverTimestamp() });
    } catch (error) {
      console.error("Error resetting application data:", error);
    }
  }, [user]);

  return (
    <ApplicationContext.Provider value={{ applicationData, updateStepData, updateCollegeAndProgram, resetApplicationData, isLoaded }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = () => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
};
