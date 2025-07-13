
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { PersonalInfoFormValues } from '@/components/forms/personal-info-form';

// Define types for all form sections. We'll add them as we create the forms.
interface ApplicationData {
  personalInfo?: PersonalInfoFormValues;
  // academics?: AcademicsFormValues;
  // language?: LanguageFormValues;
  // ... and so on for all 8 forms
}

interface ApplicationContextType {
  applicationData: ApplicationData;
  setApplicationData: (data: ApplicationData) => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

// Define initial empty state for the application data
const initialApplicationData: ApplicationData = {
   personalInfo: undefined,
};

export const ApplicationProvider = ({ children }: { children: ReactNode }) => {
  const [applicationData, setApplicationData] = useState<ApplicationData>(initialApplicationData);

  return (
    <ApplicationContext.Provider value={{ applicationData, setApplicationData }}>
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
