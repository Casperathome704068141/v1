
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

// Define types for all form sections.
interface ApplicationData {
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
  resetApplicationData: () => void;
  isLoaded: boolean;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

// Define initial empty state for the application data
const initialApplicationData: ApplicationData = {
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

  useEffect(() => {
    if (typeof window !== 'undefined' && user?.uid) {
      const savedData = localStorage.getItem(`applicationData_${user.uid}`);
      if (savedData) {
        try {
          // Add migration logic for old data structure if needed
          const parsedData = JSON.parse(savedData);
          if (parsedData.documents) {
            Object.keys(parsedData.documents).forEach(key => {
              if (parsedData.documents[key] && !Array.isArray(parsedData.documents[key].files)) {
                 if(parsedData.documents[key].fileName) {
                     parsedData.documents[key].files = [{
                        fileName: parsedData.documents[key].fileName,
                        url: parsedData.documents[key].url,
                        date: parsedData.documents[key].date,
                     }];
                 } else {
                    parsedData.documents[key].files = [];
                 }
              }
            });
          }
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
        // If user logs out, reset the state but don't mark as loaded until a user logs in.
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
        if (typeof window !== 'undefined' && user?.uid) {
            localStorage.setItem(`applicationData_${user.uid}`, JSON.stringify(newData));
        }
        return newData;
    });
  };

  const resetApplicationData = useCallback(() => {
    setApplicationData(initialApplicationData);
    if(typeof window !== 'undefined' && user?.uid) {
      localStorage.removeItem(`applicationData_${user.uid}`);
    }
  }, [user]);

  return (
    <ApplicationContext.Provider value={{ applicationData, setApplicationData, updateStepData, resetApplicationData, isLoaded }}>
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
