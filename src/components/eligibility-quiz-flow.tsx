
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QuizResults } from './quiz-results';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Send, Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type Answer = string | string[] | null;
type Answers = Record<string, Answer>;

const questions = [
  { id: 'q1_loa_status', section: 'A — Admission', text: 'Do you already have a Letter of Acceptance (LOA) from a Designated Learning Institution (DLI)?', options: [{ value: 'yes', label: 'Yes', points: 10 }, { value: 'pending', label: 'Pending', points: 5 }, { value: 'no', label: 'No', points: 0 }] },
  { id: 'q2_pgwp_eligible', section: 'A — Admission', text: 'Is the program PGWP-eligible?', options: [{ value: 'yes', label: 'Yes', points: 5 }, { value: 'unsure', label: 'Unsure', points: 2 }, { value: 'no', label: 'No', points: 0 }] },
  { id: 'q3_liquid_funds', section: 'B — Finances', text: 'Liquid funds available (excluding tuition):', options: [{ value: '>=22895', label: '≥ $22,895 CAD', points: 12 }, { value: '20-22.8k', label: '$20,000 - $22,894 CAD', points: 8 }, { value: '<20k', label: '< $20,000 CAD', points: 0 }] },
  { id: 'q4_tuition_payment', section: 'B — Finances', text: 'Tuition payment status:', options: [{ value: 'full_year', label: 'Full year paid', points: 5 }, { value: 'deposit', label: 'Deposit paid', points: 2 }, { value: 'none', label: 'None paid', points: 0 }] },
  { id: 'q5_funding_sources', section: 'B — Finances', text: 'Funding sources (select all that apply):', type: 'checkbox', options: [{ value: 'personal_savings', label: 'Personal savings', points: 4 }, { value: 'gic', label: 'GIC', points: 4 }, { value: 'loan', label: 'Loan', points: 3 }, { value: 'family_sponsor', label: 'Family sponsor', points: 2 }, { value: 'scholarship', label: 'Scholarship', points: 2 }], maxPoints: 8 },
  { id: 'q6_language_test', section: 'C — Language Ability', text: 'Which English/French test have you completed (≤ 2 yrs old)?', options: [{value: 'ielts', label: 'IELTS General or Academic', points: 0}, {value: 'toefl', label: 'TOEFL iBT', points: 0}, {value: 'pte', label: 'PTE Academic', points: 0}, {value: 'celpip', label: 'CELPIP', points: 0}, {value: 'tef', label: 'TEF Canada', points: 0}, {value: 'none', label: 'None of the above', points: 0}] },
  { id: 'q7_language_score', section: 'C — Language Ability', text: 'Highest overall score:', condition: (answers: Answers) => answers.q6_language_test !== 'none', options: [{ value: 'high', label: 'IELTS 6.0+ / TOEFL 80+ / PTE 60+', points: 10 }, { value: 'mid', label: 'IELTS 5.5', points: 5 }, { value: 'low', label: 'Below IELTS 5.5 or no valid score', points: 0 }] },
  { id: 'q8_program_start', section: 'D — Timing & Docs', text: 'How soon does your program start?', options: [{ value: '>=4', label: 'More than 4 months', points: 5 }, { value: '2-3', label: '2-3 months', points: 3 }, { value: '<2', label: 'Less than 2 months', points: 0 }] },
  { id: 'q9_passport_validity', section: 'D — Timing & Docs', text: 'Does your passport have at least 2 years of validity?', options: [{ value: 'yes', label: 'Yes', points: 3 }, { value: 'no', label: 'No, it needs renewal soon', points: 0 }] },
  { id: 'q10_docs_ready', section: 'D — Timing & Docs', text: 'Are your core documents (passport, LOA, funds proof) scanned and ready?', options: [{ value: 'all', label: 'Yes, all are ready', points: 5 }, { value: 'some', label: 'Some are ready', points: 2 }, { value: 'none', label: 'None are ready', points: 0 }] },
  { id: 'q11_pal', section: 'E — Provincial Compliance', text: 'If applicable, have you secured a Provincial Attestation Letter (PAL)?', options: [{ value: 'not_needed', label: 'Not needed for my province/program', points: 5 }, { value: 'yes', label: 'Yes, I have it', points: 5 }, { value: 'in_progress', label: "It's in progress", points: 2 }, { value: 'no', label: 'No / Unsure', points: 0 }] },
  { id: 'q12_visa_refusals', section: 'F — Risk Factors', text: 'Have you had any previous visa refusals (any country)?', options: [{ value: 'none', label: 'None', points: 5 }, { value: 'one_resolved', label: 'One, with issues addressed', points: 2 }, { value: 'multiple', label: 'Multiple refusals', points: -5 }] },
  { id: 'q13_criminal_record', section: 'F — Risk Factors', text: 'Do you have any criminal record or serious medical issues?', options: [{ value: 'no', label: 'No', points: 5 }, { value: 'yes', label: 'Yes (will require explanation)', points: -10 }] },
  { id: 'q14_program_alignment', section: 'G — Study Plan Fit', text: 'How well does your chosen program align with your past studies or work?', options: [{ value: 'direct', label: 'Directly aligns', points: 8 }, { value: 'related', label: 'Somewhat related', points: 4 }, { value: 'major_switch', label: "It's a major career switch", points: 0 }] },
  { id: 'q15_home_ties', section: 'G — Study Plan Fit', text: 'How strong are your financial and family ties to your home country?', options: [{ value: 'strong', label: 'Strong (property, family, job offer)', points: 5 }, { value: 'some', label: 'Some ties', points: 2 }, { value: 'weak', label: 'Weak or minimal ties', points: 0 }] },
];

const sectionMaxPoints: Record<string, number> = questions.reduce((acc, q) => {
    if (q.section) {
        if (!acc[q.section]) acc[q.section] = 0;
        acc[q.section] += q.type === 'checkbox' ? (q.maxPoints || 0) : Math.max(...q.options.map(o => o.points));
    }
    return acc;
}, {} as Record<string, number>);

export function EligibilityQuizFlow() {
  const [answers, setAnswers] = useState<Answers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const visibleQuestions = useMemo(() => questions.filter(q => !q.condition || q.condition(answers)), [answers]);
  const currentQuestion = visibleQuestions[currentQuestionIndex];
  const currentSection = currentQuestion?.section;

  const handleAnswerChange = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    if (currentQuestionIndex < visibleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setFinished(true);
    }
  };

  const handleCheckboxChange = (questionId: string, value: string, checked: boolean) => {
    const oldAns = (answers[questionId] as string[] || []);
    const newAns = checked ? [...oldAns, value] : oldAns.filter(v => v !== value);
    setAnswers(prev => ({ ...prev, [questionId]: newAns }));
  };
  
  const handleNextForCheckbox = () => {
     if (currentQuestionIndex < visibleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setFinished(true);
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
        const prevQuestionId = visibleQuestions[currentQuestionIndex - 1].id;
        const newAnswers = { ...answers };
        delete newAnswers[prevQuestionId];
        // Also remove answers for questions that are no longer visible
        questions.forEach(q => {
            if (q.condition && !q.condition(newAnswers)) {
                delete newAnswers[q.id];
            }
        });

        setAnswers(newAnswers);
        setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScores = () => {
    let totalScore = 0;
    const sectionScores: Record<string, number> = {};
    visibleQuestions.forEach(q => {
      if (!sectionScores[q.section]) sectionScores[q.section] = 0;
      const answerValue = answers[q.id];
      if (answerValue) {
        if (q.type === 'checkbox' && Array.isArray(answerValue)) {
          let points = answerValue.reduce((sum, val) => sum + (q.options.find(opt => opt.value === val)?.points || 0), 0);
          points = Math.min(points, q.maxPoints || 0);
          totalScore += points;
          sectionScores[q.section] += points;
        } else if (typeof answerValue === 'string') {
          const points = q.options.find(opt => opt.value === answerValue)?.points || 0;
          totalScore += points;
          sectionScores[q.section] += points;
        }
      }
    });
    return { totalScore, sectionScores };
  };

  useEffect(() => {
    if (finished && user?.uid) {
      const { totalScore, sectionScores } = calculateScores();
      setDoc(doc(db, 'users', user.uid, 'quizResults', 'eligibility'), {
        score: totalScore,
        sectionScores,
        answers,
        takenAt: serverTimestamp(),
      }).catch(error => toast({ title: "Error Saving Results", description: "Your results could not be saved.", variant: "destructive" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished, user]);

  if (finished) {
    const { totalScore, sectionScores } = calculateScores();
    return <QuizResults totalScore={totalScore} sectionScores={sectionScores} onReset={() => { setAnswers({}); setCurrentQuestionIndex(0); setFinished(false); }} sectionMaxPoints={sectionMaxPoints} answers={answers} />;
  }

  if (!currentQuestion) return null;

  const progressPercentage = (currentQuestionIndex / visibleQuestions.length) * 100;

  return (
    <Card className="max-w-3xl mx-auto overflow-hidden border-border/50 shadow-xl">
      <div className="p-6 text-center bg-muted/50 border-b border-border/50">
        <h1 className="text-2xl font-black tracking-tighter">Eligibility Quiz</h1>
        <p className="text-muted-foreground mt-1">Answer these questions to estimate your study permit eligibility.</p>
        <div className="pt-4 space-y-2">
            <Progress value={progressPercentage} className="h-3"/>
            <p className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {visibleQuestions.length}</p>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <CardContent className="py-8 px-6">
            <div className="text-center mb-6">
              <p className="text-sm font-semibold uppercase text-primary mb-2">{currentSection}</p>
              <p className="text-xl font-bold mb-4">{currentQuestion.text}</p>
            </div>
            <div className="space-y-3 max-w-lg mx-auto">
              {currentQuestion.options.map(opt => {
                if (currentQuestion.type === 'checkbox') {
                  const isSelected = ((answers[currentQuestion.id] as string[]) || []).includes(opt.value);
                  return (
                    <Label
                      key={opt.value}
                      htmlFor={`${currentQuestion.id}-${opt.value}`}
                      className={cn(
                        `flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-all duration-200`,
                        isSelected ? 'border-primary bg-primary/10 ring-2 ring-primary/50' : 'hover:border-primary/50 bg-background'
                      )}
                    >
                      <Checkbox
                        id={`${currentQuestion.id}-${opt.value}`}
                        checked={isSelected}
                        onCheckedChange={checked => handleCheckboxChange(currentQuestion.id, opt.value, !!checked)}
                        className="h-6 w-6"
                      />
                      <span className="flex-1 text-base font-medium">{opt.label}</span>
                    </Label>
                  );
                }
                return (
                  <motion.div key={opt.value} whileTap={{ scale: 0.98 }}>
                    <div
                      onClick={() => handleAnswerChange(currentQuestion.id, opt.value)}
                      className={cn(
                        `flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-all duration-200`,
                        answers[currentQuestion.id] === opt.value ? 'border-primary bg-primary/10 ring-2 ring-primary/50' : 'hover:border-primary/50 bg-background'
                      )}
                    >
                       <div className="h-6 w-6 rounded-full border-2 border-primary flex items-center justify-center transition-all">
                         {answers[currentQuestion.id] === opt.value && <div className="h-3 w-3 rounded-full bg-primary transition-all"/>}
                       </div>
                      <span className="flex-1 text-base font-medium">{opt.label}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </motion.div>
      </AnimatePresence>
      <CardFooter className="flex justify-between border-t bg-muted/50 py-4 px-6">
        <Button variant="ghost" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        {currentQuestion.type === 'checkbox' && (
           <Button 
            onClick={handleNextForCheckbox}
            disabled={!answers[currentQuestion.id] || (Array.isArray(answers[currentQuestion.id]) && (answers[currentQuestion.id] as string[]).length === 0)}
            className="bg-electric-violet hover:bg-[#8A2BE2]/90"
           >
             {currentQuestionIndex === visibleQuestions.length - 1 ? 'Finish & See Results' : 'Next'} <Send className="ml-2 h-4 w-4" />
           </Button>
        )}
      </CardFooter>
    </Card>
  );
}
