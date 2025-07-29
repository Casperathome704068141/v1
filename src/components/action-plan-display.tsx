
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { generateActionPlan } from '@/ai/flows/generate-action-plan';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Lightbulb, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

// A simple markdown-to-HTML converter
const toHtml = (text: string) => {
    return text
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2 text-primary">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-black tracking-tight mt-8 mb-4 border-b-2 border-primary/20 pb-2">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-black tracking-tighter mb-4">$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/^- (.*$)/gim, '<li class="ml-6 mb-3 list-disc text-lg">$1</li>')
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
      
      if (!quizAnswers || !sectionScores || quizAnswers === '{}' || sectionScores === '{}') {
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
       <div className="text-center p-8">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block"
            >
                <Zap className="h-16 w-16 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-bold mt-4">Generating Your AI Action Plan...</h2>
            <p className="text-muted-foreground">This may take a few moments. Please wait.</p>
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
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: toHtml(actionPlan) }} 
    />
  );
}
