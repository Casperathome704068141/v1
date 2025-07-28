
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
import { Checkbox } from '../ui/checkbox';
import { Label } from '@/components/ui/label';

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
  { id: 'q11_pal', section: 'E — Provincial Compliance', text: 'If applicable, have you secured a Provincial Attestation Letter (PAL)?', options: [{ value: 'not_needed', label: 'Not needed for my province/program', points: 5 }, { value: 'yes', label: 'Yes, I have it', points: 5 }, { value: 'in_progress', label: 'It\'s in progress', points: 2 }, { value: 'no', label: 'No / Unsure', points: 0 }] },
  { id: 'q12_visa_refusals', section: 'F — Risk Factors', text: 'Have you had any previous visa refusals (any country)?', options: [{ value: 'none', label: 'None', points: 5 }, { value: 'one_resolved', label: 'One, with issues addressed', points: 2 }, { value: 'multiple', label: 'Multiple refusals', points: -5 }] },
  { id: 'q13_criminal_record', section: 'F — Risk Factors', text: 'Do you have any criminal record or serious medical issues?', options: [{ value: 'no', label: 'No', points: 5 }, { value: 'yes', label: 'Yes (will require explanation)', points: -10 }] },
  { id: 'q14_program_alignment', section: 'G — Study Plan Fit', text: 'How well does your chosen program align with your past studies or work?', options: [{ value: 'direct', label: 'Directly aligns', points: 8 }, { value: 'related', label: 'Somewhat related', points: 4 }, { value: 'major_switch', label: 'It\'s a major career switch', points: 0 }] },
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
  const [finished, setFinished] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const visibleQuestions = useMemo(() => questions.filter(q => !q.condition || q.condition(answers)), [answers]);
  const currentQuestionIndex = useMemo(() => visibleQuestions.findIndex(q => answers[q.id] === undefined), [visibleQuestions, answers]);
  
  useEffect(() => {
    if (currentQuestionIndex === -1 && Object.keys(answers).length >= visibleQuestions.length) {
      setFinished(true);
    }
  }, [currentQuestionIndex, answers, visibleQuestions.length]);

  const currentQuestion = visibleQuestions[currentQuestionIndex];

  const handleAnswerChange = (questionId: string, value: string | string[]) => setAnswers(prev => ({ ...prev, [questionId]: value }));

  const handleCheckboxChange = (questionId: string, value: string, checked: boolean) => {
    const oldAns = (answers[questionId] as string[] || []);
    const newAns = checked ? [...oldAns, value] : oldAns.filter(v => v !== value);
    handleAnswerChange(questionId, newAns);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevQId = visibleQuestions[currentQuestionIndex - 1].id;
      const newAnswers = { ...answers };
      delete newAnswers[prevQId];
      questions.forEach(q => { if (q.condition && !q.condition(newAnswers)) delete newAnswers[q.id]; });
      setAnswers(newAnswers);
    }
  };

  const calculateScores = () => {
    let totalScore = 0;
    const sectionScores: Record<string, number> = {};
    questions.forEach(q => {
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
  }, [finished, user, answers, toast]);

  if (finished) {
    const { totalScore, sectionScores } = calculateScores();
    return <QuizResults totalScore={totalScore} sectionScores={sectionScores} onReset={() => { setAnswers({}); setFinished(false); }} sectionMaxPoints={sectionMaxPoints} answers={answers} />;
  }

  if (!currentQuestion) return null;

  const progressPercentage = (currentQuestionIndex / visibleQuestions.length) * 100;

  return (
    <Card className="max-w-3xl mx-auto overflow-hidden">
      <CardHeader>
        <CardTitle>Eligibility Quiz</CardTitle>
        <CardDescription>Answer these questions to get an estimate of your study permit eligibility.</CardDescription>
        <div className="pt-2">
            <Progress value={progressPercentage} />
            <p className="text-sm text-muted-foreground mt-2 text-center">Question {currentQuestionIndex + 1} of {visibleQuestions.length}</p>
        </div>
      </CardHeader>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <CardContent className="py-6">
            <p className="text-lg font-semibold mb-4">{currentQuestion.text}</p>
            <div className="space-y-3">
              {currentQuestion.options.map(opt => {
                const isSelected = currentQuestion.type === 'checkbox'
                  ? ((answers[currentQuestion.id] as string[]) || []).includes(opt.value)
                  : answers[currentQuestion.id] === opt.value;
                
                return (
                  <motion.div key={opt.value} whileTap={{ scale: 0.98 }}>
                    <Label
                      htmlFor={`${currentQuestion.id}-${opt.value}`}
                      className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-all ${
                        isSelected ? 'border-primary bg-primary/10' : 'hover:border-primary/50'
                      }`}
                    >
                      {currentQuestion.type === 'checkbox' ? (
                          <Checkbox
                            id={`${currentQuestion.id}-${opt.value}`}
                            checked={isSelected}
                            onCheckedChange={checked => handleCheckboxChange(currentQuestion.id, opt.value, !!checked)}
                            className="h-6 w-6"
                          />
                      ) : (
                          <Check className={`h-6 w-6 rounded-full p-1 transition-all ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`} />
                      )}
                      <span className="flex-1 text-base">{opt.label}</span>
                    </Label>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </motion.div>
      </AnimatePresence>
      <CardFooter className="flex justify-between border-t bg-muted/50 py-4">
        <Button variant="ghost" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button 
            onClick={() => {if (currentQuestionIndex === visibleQuestions.length - 1) setFinished(true);}}
            disabled={!answers[currentQuestion.id] || (Array.isArray(answers[currentQuestion.id]) && (answers[currentQuestion.id] as string[]).length === 0)}
        >
          {currentQuestionIndex === visibleQuestions.length - 1 ? 'Finish & See Results' : 'Next'} <Send className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
