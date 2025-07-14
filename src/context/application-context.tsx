
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { PersonalInfoFormValues } from '@/components/forms/personal-info-form';
import type { AcademicsFormValues } from '@/components/forms/academics-form';
import type { LanguageFormValues } from '@/components/forms/language-form';
import type { FinancesFormValues } from '@/components/forms/finances-form';
import type { StudyPlanFormValues } from '@/components/forms/study-plan-form';
import type { FamilyFormValues } from '@/components/forms/family-form';
import type { BackgroundFormValues } from '@/components/forms/background-form';

// Documents state is simpler for now
interface DocumentStatus {
    status: 'Uploaded' | 'Pending' | 'Action Required' | 'Not Applicable';
    url?: string;
    fileName?: string;
    message?: string;
    date?: string; // ISO date string
}

interface DocumentsData {
  [key: string]: DocumentStatus;
}

// Define types for all form sections.
interface ApplicationData {
  personalInfo?: PersonalInfoFormValues;
  academics?: AcademicsFormValues;
  language?: LanguageFormValues;
  finances?: FinancesFormValues;
  studyPlan?: StudyPlanFormValues;
  family?: FamilyFormValues;
  background?: BackgroundFormValues;
  documents?: DocumentsData;
}

interface ApplicationContextType {
  applicationData: ApplicationData;
  setApplicationData: (data: ApplicationData) => void;
  updateStepData: (step: keyof ApplicationData, data: any) => void;
  resetApplicationData: () => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

// Define initial empty state for the application data
const initialApplicationData: ApplicationData = {
   personalInfo: undefined,
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
  
  const updateStepData = (step: keyof ApplicationData, data: any) => {
    setApplicationData(prev => ({
        ...prev,
        [step]: data,
    }));
  };

  const resetApplicationData = useCallback(() => {
    setApplicationData(initialApplicationData);
  }, []);

  return (
    <ApplicationContext.Provider value={{ applicationData, setApplicationData, updateStepData, resetApplicationData }}>
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
