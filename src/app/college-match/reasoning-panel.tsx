
'use client';

import { useState, useEffect } from 'react';
import { collegeMatchReasoning, CollegeMatchReasoningInput } from '@/ai/flows/college-match-reasoning';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

type ReasoningPanelProps = {
  dliDetails: {
    name: string;
    province: string;
    tuition: number;
  };
  studentProfile: object;
  filteringLogic: string;
  initialReasoning: string;
};

export function ReasoningPanel({ dliDetails, studentProfile, filteringLogic, initialReasoning }: ReasoningPanelProps) {
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
        initialReasoning: initialReasoning
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
  }, [dliDetails.name, filteringLogic]);

  if (loading) {
    return (
      <div className="flex items-center justify-center space-x-2 p-4">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
            <Zap className="h-5 w-5 text-primary" />
        </motion.div>
        <p className="text-sm font-semibold text-muted-foreground">Analyzing Match...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return <p className="text-sm text-muted-foreground leading-relaxed">{reasoning}</p>;
}
