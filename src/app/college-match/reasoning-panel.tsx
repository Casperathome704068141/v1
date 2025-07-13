'use client';

import { useState, useEffect } from 'react';
import { collegeMatchReasoning, CollegeMatchReasoningInput } from '@/ai/flows/college-match-reasoning';
import { Skeleton } from '@/components/ui/skeleton';

type ReasoningPanelProps = {
  dliDetails: {
    name: string;
    province: string;
  };
};

export function ReasoningPanel({ dliDetails }: ReasoningPanelProps) {
  const [reasoning, setReasoning] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getReasoning() {
      setLoading(true);
      setError(null);

      // Mocked data for demonstration purposes
      const mockStudentProfile = {
        academicScore: '85%',
        financialSituation: 'Has proof of funds for 1 year',
        programOfInterest: 'Postgraduate Diploma in Business Management',
      };
      
      const mockFilteringLogic = 'Filtered for postgraduate diplomas in Ontario with tuition under $20,000/year.';

      const input: CollegeMatchReasoningInput = {
        profileDetails: JSON.stringify(mockStudentProfile, null, 2),
        dliDetails: JSON.stringify(dliDetails, null, 2),
        filteringLogic: mockFilteringLogic,
      };

      try {
        const result = await collegeMatchReasoning(input);
        // Add a small delay for a better UX, as the AI response can be very fast
        setTimeout(() => {
            setReasoning(result.reasoning);
            setLoading(false);
        }, 500);

      } catch (err) {
        console.error('Error fetching AI reasoning:', err);
        setError('Could not load AI reasoning at this time.');
        setLoading(false);
      }
    }

    getReasoning();
  }, [dliDetails]);

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return <p className="text-sm text-muted-foreground">{reasoning}</p>;
}
