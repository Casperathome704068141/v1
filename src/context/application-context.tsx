
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

export interface UploadedFile {
    url: string;
    fileName: string;
    date: string; // ISO date string
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
];

// Define types for all form sections.
interface ApplicationData {
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
  setApplicationData: (data: ApplicationData) => void;
  updateStepData: (step: keyof ApplicationData, data: any) => void;
  updateCollegeAndProgram: (college: College, program: string) => void;
  resetApplicationData: () => void;
  isLoaded: boolean;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

// Define initial empty state for the application data
const initialApplicationData: ApplicationData = {
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

export const ApplicationProvider = ({ children }: { children: ReactNode }) => {
  const [applicationData, setApplicationData] = useState<ApplicationData>(initialApplicationData);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  const persistData = (data: ApplicationData) => {
    if (typeof window !== 'undefined' && user?.uid) {
        localStorage.setItem(`applicationData_${user.uid}`, JSON.stringify(data));
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && user?.uid) {
      const savedData = localStorage.getItem(`applicationData_${user.uid}`);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setApplicationData(parsedData);
        } catch (e) {
            console.error("Failed to parse application data from localStorage", e);
            setApplicationData(initialApplicationData);
        }
      } else {
        setApplicationData(initialApplicationData);
      }
      setIsLoaded(true);
    } else if (!user) {
        setApplicationData(initialApplicationData);
        setIsLoaded(false);
    }
  }, [user]);
  
  const updateStepData = (step: keyof ApplicationData, data: any) => {
    setApplicationData(prev => {
        const newData = {
            ...prev,
            [step]: data,
        };
        persistData(newData);
        return newData;
    });
  };

  const updateCollegeAndProgram = (college: College, program: string) => {
    setApplicationData(prev => {
        const newData = {
            ...prev,
            selectedCollege: college,
            studyPlan: {
              ...prev.studyPlan,
              programChoice: program,
            },
        };
        persistData(newData);
        return newData;
    });
  }

  const resetApplicationData = useCallback(() => {
    setApplicationData(initialApplicationData);
    if(typeof window !== 'undefined' && user?.uid) {
      localStorage.removeItem(`applicationData_${user.uid}`);
    }
  }, [user]);

  return (
    <ApplicationContext.Provider value={{ applicationData, setApplicationData, updateStepData, updateCollegeAndProgram, resetApplicationData, isLoaded }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = () => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return