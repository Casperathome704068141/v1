
import { UserCheck, FileText, Send, CheckCircle, Circle, Check, Languages, HandCoins, School, Users, ShieldQuestion } from 'lucide-react';
import { useApplication, documentList } from '@/context/application-context';

export const applicationStepsConfig = [
    { id: 'profile', name: 'Personal Info', icon: UserCheck },
    { id: 'academics', name: 'Academics & Work', icon: FileText },
    { id: 'language', name: 'Language', icon: Languages },
    { id: 'finances', name: 'Finances', icon: HandCoins },
    { id: 'plan', name: 'Study Plan', icon: School },
    { id: 'family', name: 'Family', icon: Users },
    { id: 'background', name: 'Background', icon: ShieldQuestion },
    { id: 'documents', name: 'Documents', icon: FileText },
];

export const isStepCompleted = (stepId: string, applicationData: any) => {
    if (!applicationData || !applicationData[stepId]) return false;
    
    const data = applicationData[stepId];

    if (typeof data === 'object' && data !== null && Object.keys(data).length === 0) {
        return false;
    }

    switch (stepId) {
        case 'profile':
            return !!data.surname && !!data.givenNames && !!data.dob && !!data.passportNumber;
        case 'academics':
            return Array.isArray(data.educationHistory) && data.educationHistory.length > 0;
        case 'language':
            return data.testTaken && (data.testTaken !== 'none' ? !!data.overallScore : !!data.testPlanning);
        case 'finances':
            return !!data.totalFunds && Array.isArray(data.fundingSources) && data.fundingSources.length > 0;
        case 'plan':
            return !!data.whyInstitution && !!data.howProgramFitsCareer;
        case 'family':
            return !!data.parent1Name && !!data.maritalStatus;
        case 'background':
            return data.certification === true;
        case 'documents':
            const requiredDocs = documentList.filter(d => d.category === 'Core');
            return requiredDocs.every(doc => applicationData.documents?.[doc.id]?.files?.length > 0);
        default:
            return false;
    }
};
