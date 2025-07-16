
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { QuizResults } from './quiz-results';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type Answer = string | string[] | null;
type Answers = Record<string, Answer>;

const questions = [
  // Section A: Admission
  {
    id: 'q1_loa_status',
    section: 'A — Admission',
    text: 'Do you already have a Letter of Acceptance (LOA) from a Designated Learning Institution (DLI)?',
    options: [
      { value: 'yes', label: 'Yes', points: 10 },
      { value: 'pending', label: 'Pending', points: 5 },
      { value: 'no', label: 'No', points: 0 },
    ],
  },
  {
    id: 'q2_pgwp_eligible',
    section: 'A — Admission',
    text: 'Is the program PGWP-eligible? Check school’s list or July 2025 IRCC update.',
    options: [
      { value: 'yes', label: 'Yes', points: 5 },
      { value: 'unsure', label: 'Unsure', points: 2 },
      { value: 'no', label: 'No', points: 0 },
    ],
  },
  // Section B: Finances
  {
    id: 'q3_liquid_funds',
    section: 'B — Finances',
    text: 'Liquid funds available (excluding tuition):',
    options: [
      { value: '>=22895', label: '≥ $22,895', points: 12 },
      { value: '20-22.8k', label: '$20,000 - $22,894', points: 8 },
      { value: '<20k', label: '< $20,000', points: 0 },
    ],
  },
  {
    id: 'q4_tuition_payment',
    section: 'B — Finances',
    text: 'Tuition payment status:',
    options: [
      { value: 'full_year', label: 'Full year paid', points: 5 },
      { value: 'deposit', label: 'Deposit paid', points: 2 },
      { value: 'none', label: 'None paid', points: 0 },
    ],
  },
  {
    id: 'q5_funding_sources',
    section: 'B — Finances',
    text: 'Funding sources (multi-select, cap 8 pts):',
    type: 'checkbox',
    options: [
      { value: 'personal_savings', label: 'Personal savings', points: 4 },
      { value: 'gic', label: 'GIC', points: 4 },
      { value: 'loan', label: 'Loan', points: 3 },
      { value: 'family_sponsor', label: 'Family sponsor', points: 2 },
      { value: 'scholarship', label: 'Scholarship', points: 2 },
    ],
    maxPoints: 8,
  },
  // Section C: Language Ability
  {
    id: 'q6_language_test',
    section: 'C — Language Ability',
    text: 'Which test have you completed (≤ 2 yrs)?',
    options: [
        {value: 'ielts', label: 'IELTS', points: 0},
        {value: 'toefl', label: 'TOEFL', points: 0},
        {value: 'pte', label: 'PTE', points: 0},
        {value: 'duolingo', label: 'Duolingo', points: 0},
        {value: 'tef', label: 'TEF', points: 0},
        {value: 'none', label: 'None', points: 0},
    ]
  },
  {
    id: 'q7_language_score',
    section: 'C — Language Ability',
    text: 'Highest overall score:',
    condition: (answers: Answers) => answers.q6_language_test !== 'none',
    options: [
      { value: 'high', label: 'IELTS 6.0+ / TOEFL 80+ / PTE 60+ / Duolingo 115+ / TEF B2+', points: 10 },
      { value: 'mid', label: 'IELTS 5.5 – 5.9 / DET 100-114', points: 5 },
      { value: 'low', label: 'No valid score', points: 0 },
    ],
  },
  // Section D: Timing & Docs
  {
      id: 'q8_program_start',
      section: 'D — Timing & Docs',
      text: 'Months until program starts:',
      options: [
          { value: '>=4', label: '≥ 4 months', points: 5 },
          { value: '2-3', label: '2-3 months', points: 3 },
          { value: '<2', label: '< 2 months', points: 0 },
      ]
  },
  {
      id: 'q9_passport_validity',
      section: 'D — Timing & Docs',
      text: 'Passport validity covers program end + 6 mo?',
      options: [
          { value: 'yes', label: 'Yes', points: 3 },
          { value: 'no', label: 'Needs renewal', points: 0 },
      ]
  },
  {
      id: 'q10_docs_ready',
      section: 'D — Timing & Docs',
      text: 'Core documents scanned & ready? (passport, LOA, funds, test result)',
      options: [
          { value: 'all', label: 'All', points: 5 },
          { value: 'some', label: 'Some', points: 2 },
          { value: 'few', label: 'Few', points: 0 },
      ]
  },
  // Section E: Provincial Compliance
  {
      id: 'q11_pal',
      section: 'E — Provincial Compliance',
      text: 'If studying in ON, BC, NS, or NB, have you secured the required Provincial Attestation Letter (PAL)?',
      options: [
          { value: 'not_needed', label: 'Not needed', points: 5 },
          { value: 'yes', label: 'Yes', points: 5 },
          { value: 'in_progress', label: 'In progress', points: 2 },
          { value: 'no', label: 'No', points: 0 },
      ]
  },
  // Section F: Risk Factors
  {
      id: 'q12_visa_refusals',
      section: 'F — Risk Factors',
      text: 'Previous visa refusals?',
      options: [
          { value: 'none', label: 'None', points: 5 },
          { value: 'one_resolved', label: 'One resolved', points: 2 },
          { value: 'multiple', label: 'Multiple', points: -5 },
      ]
  },
  {
      id: 'q13_criminal_record',
      section: 'F — Risk Factors',
      text: 'Any criminal record, serious medical issue, or deportation?',
      options: [
          { value: 'no', label: 'No', points: 5 },
          { value: 'minor', label: 'Minor & documented', points: 1 },
          { value: 'serious', label: 'Serious', points: -10 },
      ]
  },
  // Section G: Study Plan Fit
  {
      id: 'q14_program_alignment',
      section: 'G — Study Plan Fit',
      text: 'Program aligns with past studies/work?',
      options: [
          { value: 'direct', label: 'Direct', points: 8 },
          { value: 'related', label: 'Related', points: 4 },
          { value: 'major_switch', label: 'Major switch', points: 0 },
      ]
  },
  {
      id: 'q15_home_ties',
      section: 'G — Study Plan Fit',
      text: 'Home-country ties (job offer, property, family biz)?',
      options: [
          { value: 'strong', label: 'Strong', points: 5 },
          { value: 'some', label: 'Some', points: 2 },
          { value: 'weak', label: 'Weak', points: 0 },
      ]
  }
];

const sectionMaxPoints: Record<string, number> = questions.reduce((acc, q) => {
    if (q.section) {
        if (!acc[q.section]) {
            acc[q.section] = 0;
        }
        if (q.type === 'checkbox') {
            acc[q.section] += q.maxPoints || 0;
        } else {
            acc[q.section] += Math.max(...q.options.map(o => o.points));
        }
    }
    return acc;
}, {} as Record<string, number>);


export function EligibilityQuizFlow() {
  const [answers, setAnswers] = useState<Answers>({});
  const [finished, setFinished] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const visibleQuestions = useMemo(() => {
    const visible = [];
    for (const q of questions) {
      if (!q.condition || q.condition(answers)) {
        visible.push(q);
      }
    }
    return visible;
  }, [answers]);

  const currentQuestionIndex = useMemo(() => {
    return visibleQuestions.findIndex(q => answers[q.id] === undefined);
  }, [visibleQuestions, answers]);

  const currentQuestion = useMemo(() => {
     if (currentQuestionIndex === -1 && Object.keys(answers).length >= visibleQuestions.length) {
        setFinished(true);
        return null;
    }
    return visibleQuestions[currentQuestionIndex];
  }, [currentQuestionIndex, visibleQuestions, answers]);

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };
  
  const handleCheckboxChange = (questionId: string, value: string, checked: boolean) => {
    const oldAnswers = (answers[questionId] as string[] || []);
    const newAnswers = checked ? [...oldAnswers, value] : oldAnswers.filter(v => v !== value);
    handleAnswerChange(questionId, newAnswers);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevQuestionId = visibleQuestions[currentQuestionIndex - 1].id;
      const newAnswers = { ...answers };
      delete newAnswers[prevQuestionId];
      // Also remove answers from any questions that were branched from the previous one
      for (const q of questions) {
        if (q.condition && q.condition(newAnswers) === false) {
          delete newAnswers[q.id];
        }
      }
      setAnswers(newAnswers);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setFinished(false);
  };

  const progressPercentage = (currentQuestionIndex / visibleQuestions.length) * 100;
  
  const calculateScores = () => {
    let totalScore = 0;
    const sectionScores: Record<string, number> = {};

    for (const q of questions) {
        if (!sectionScores[q.section]) {
            sectionScores[q.section] = 0;
        }

        const answerValue = answers[q.id];
        if (answerValue) {
            if (q.type === 'checkbox' && Array.isArray(answerValue)) {
                let checkboxPoints = 0;
                for (const val of answerValue) {
                    const option = q.options.find(opt => opt.value === val);
                    if (option) {
                        checkboxPoints += option.points;
                    }
                }
                const points = Math.min(checkboxPoints, q.maxPoints || 0);
                totalScore += points;
                sectionScores[q.section] += points;
            } else if (typeof answerValue === 'string') {
                const answer = q.options.find(opt => opt.value === answerValue);
                if (answer) {
                    totalScore += answer.points;
                    sectionScores[q.section] += answer.points;
                }
            }
        }
    }
    return { totalScore, sectionScores };
  }
  
  const { totalScore, sectionScores } = calculateScores();

  useEffect(() => {
    if (finished) {
      if (user?.uid) {
        const saveResults = async () => {
          try {
            await setDoc(doc(db, 'users', user.uid, 'quizResults', 'eligibility'), {
              score: totalScore,
              sectionScores,
              answers,
              takenAt: serverTimestamp(),
            });
          } catch (error) {
            console.error("Error saving quiz results: ", error);
            toast({
              title: "Error",
              description: "Could not save quiz results. Please try again.",
              variant: "destructive",
            });
          }
        };
        saveResults();
      }
    }
  }, [finished, user, totalScore, sectionScores, answers, toast]);
  
  if (finished) {
    return <QuizResults totalScore={totalScore} sectionScores={sectionScores} onReset={handleReset} sectionMaxPoints={sectionMaxPoints} answers={answers} />;
  }

  if (!currentQuestion) {
    // This can happen briefly while state is updating.
    return null; 
  }

  const currentAnswer = answers[currentQuestion.id];

  return (
    <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>{currentQuestion.section}: Question {currentQuestionIndex + 1} of {visibleQuestions.length}</CardTitle>
            <Progress value={progressPercentage} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
            <p className="text-lg font-medium">{currentQuestion.text}</p>
            {currentQuestion.type === 'checkbox' ? (
                 <div className="space-y-2">
                    {currentQuestion.options.map(opt => (
                        <div key={opt.value} className="flex items-center space-x-2">
                             <Checkbox
                                id={`${currentQuestion.id}-${opt.value}`}
                                checked={(currentAnswer as string[] || []).includes(opt.value)}
                                onCheckedChange={(checked) => handleCheckboxChange(currentQuestion.id, opt.value, !!checked)}
                            />
                            <Label htmlFor={`${currentQuestion.id}-${opt.value}`} className="text-base font-normal">
                                {opt.label}
                            </Label>
                        </div>
                    ))}
                 </div>
            ) : (
                <RadioGroup
                    value={(currentAnswer as string) || ''}
                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                    className="space-y-2"
                >
                    {currentQuestion.options.map(opt => (
                        <div key={opt.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt.value} id={`${currentQuestion.id}-${opt.value}`} />
                            <Label htmlFor={`${currentQuestion.id}-${opt.value}`} className="text-base font-normal">
                                {opt.label}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                 Previous
            </Button>
            <Button 
                onClick={() => {
                    if (currentQuestionIndex === visibleQuestions.length - 1) {
                        setFinished(true);
                    }
                }}
                disabled={!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0)}
            >
                {currentQuestionIndex === visibleQuestions.length - 1 ? 'Finish' : 'Next'}
            </Button>
        </CardFooter>
    </Card>
  );
}
