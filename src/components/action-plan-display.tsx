
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { generateActionPlan } from '@/ai/flows/generate-action-plan';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

// A simple markdown-to-HTML converter
const toHtml = (text: string) => {
    return text
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-2">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/^- (.*$)/gim, '<li class="ml-4 mb-2 list-disc">$1</li>')
        .replace(/\n/g, '<br />');
};


export function ActionPlanDisplay() {
  const searchParams = useSearchParams();
  const [actionPlan, setActionPlan] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const quizAnswers = useMemo(() => searchParams.get('answers') || '{}', [searchParams]);
  const sectionScores = useMemo(() => searchParams.get('scores') || '{}', [searchParams]);


  useEffect(() => {
    async function getActionPlan() {
      setLoading(true);
      setError(null);
      
      if (!quizAnswers || !sectionScores) {
        setError("Quiz data is missing. Please retake the quiz.");
        setLoading(false);
        return;
      }

      try {
        const result = await generateActionPlan({ quizAnswers, sectionScores });
        setActionPlan(result.actionPlan);
      } catch (err) {
        console.error('Error fetching AI action plan:', err);
        setError('Could not load your action plan at this time. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    getActionPlan();
  }, [quizAnswers, sectionScores]);

  if (loading) {
    return (
       <div className="space-y-6">
            <div className="space-y-2">
                <div className="h-6 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-4/5 bg-gray-200 animate-pulse rounded"></div>
            </div>
             <div className="space-y-2">
                <div className="h-6 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-4/5 bg-gray-200 animate-pulse rounded"></div>
            </div>
        </div>
    );
  }

  if (error) {
    return (
        <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    )
  }

  return (
    <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: toHtml(actionPlan) }} 
    />
  );
}
