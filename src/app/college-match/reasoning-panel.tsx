
'use client';

import { useState, useEffect } from 'react';
import { collegeMatchReasoning, CollegeMatchReasoningInput } from '@/ai/flows/college-match-reasoning';
import { Skeleton } from '@/components/ui/skeleton';

type ReasoningPanelProps = {
  dliDetails: {
    name: string;
    province: string;
  };
  studentProfile: object;
  filteringLogic: string;
};

export function ReasoningPanel({ dliDetails, studentProfile, filteringLogic }: ReasoningPanelProps) {
  const [reasoning, setReasoning] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getReasoning() {
      setLoading(true);
      setError(null);
      
      const input: CollegeMatchReasoningInput = {
        profileDetails: JSON.stringify(studentProfile, null, 2),
        dliDetails: JSON.stringify(dliDetails, null, 2),
        filteringLogic: filteringLogic,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dliDetails, filteringLogic]);

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
