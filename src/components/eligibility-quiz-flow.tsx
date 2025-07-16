
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuizResults } from './quiz-results';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

type Answer = string | null;
type Answers = Record<string, Answer>;

const questions = [
  // Section A: Admission
  {
    id: 'q1_loa_status',
    text: 'Do you already have a Letter of Acceptance (LOA) from a Designated Learning Institution (DLI)?',
    section: 'Admission',
    options: [
      { value: 'yes', label: 'Yes', points: 20 },
      { value: 'submitted', label: 'No, but my application is submitted', points: 10 },
      { value: 'researching', label: 'No, I am still researching schools', points: 0 },
    ],
  },
  {
    id: 'q2_loa_timing',
    text: 'When do you expect to secure an LOA?',
    section: 'Admission',
    condition: (answers: Answers) => answers.q1_loa_status !== 'yes',
    options: [
      { value: '4_weeks', label: 'Within 4 weeks', points: 5 },
      { value: '3_months', label: 'Within 3 months', points: 3 },
      { value: 'not_sure', label: 'Not sure', points: 0 },
    ],
  },
  // Section B: Finances
  {
    id: 'q3_funding_amount',
    text: 'How much liquid funding (cash, GIC, tuition paid) do you have available?',
    section: 'Finances',
    options: [
      { value: '20k_plus', label: 'Tuition + $20,000 CAD or more', points: 15 },
      { value: '10k_to_20k', label: 'Tuition + $10,000 to $19,999 CAD', points: 10 },
      { value: 'less_10k', label: 'Less than tuition + $10,000 CAD, or unsure', points: 0 },
    ],
  },
  {
    id: 'q4_funding_source',
    text: 'What is the primary source of your funds?',
    section: 'Finances',
    options: [
      { value: 'self', label: 'Personal savings / GIC', points: 5 },
      { value: 'family', label: 'Family sponsor with bank proof', points: 3 },
      { value: 'loan', label: 'Loan / scholarship (pending)', points: 2 },
      { value: 'unclear', label: 'No clear source yet', points: 0 },
    ],
  },
  {
    id: 'q5_sds_status',
    text: 'Are you applying from a country eligible for the Student Direct Stream (SDS)?',
    section: 'Finances',
    options: [
      { value: 'yes_ready', label: 'Yes, and I have a $10k+ GIC and tuition paid receipt', points: 5 },
      { value: 'yes_not_ready', label: "Yes, but I'm missing the GIC or tuition receipt", points: 2 },
      { value: 'no', label: 'No, my country is not on the SDS list', points: 0 },
    ],
  },
  // Section C: Language
  {
    id: 'q6_language_test_taken',
    text: 'Have you taken an approved English/French test (e.g., IELTS, TOEFL) in the last 2 years?',
    section: 'Language',
    options: [
      { value: 'yes', label: 'Yes', points: 0 }, // Points awarded in followup
      { value: 'no', label: 'No', points: 0 },
    ],
  },
  {
    id: 'q6a_language_score',
    text: 'What was your overall score?',
    section: 'Language',
    type: 'select',
    condition: (answers: Answers) => answers.q6_language_test_taken === 'yes',
    options: [
      { value: 'high', label: 'IELTS 6.0+ / TOEFL 80+ / PTE 60+ / TEF B2+', points: 10 },
      { value: 'low', label: 'My score was below these thresholds', points: 4 },
    ],
  },
  {
    id: 'q7_language_test_booking',
    text: 'Have you scheduled your language test?',
    section: 'Language',
    condition: (answers: Answers) => answers.q6_language_test_taken === 'no',
    options: [
      { value: 'yes', label: 'Yes, it is booked for the next 60 days', points: 5 },
      { value: 'no', label: 'No, it is not booked yet', points: 0 },
    ],
  },
  // Section D: Docs & Timing
  {
    id: 'q8_passport_validity',
    text: 'Is your passport valid for your entire planned study period plus at least 6 months?',
    section: 'Docs & Timing',
    options: [
      { value: 'yes', label: 'Yes, it is', points: 5 },
      { value: 'no', label: 'No, it expires sooner or needs renewal', points: 0 },
    ],
  },
  {
    id: 'q9_intake_date',
    text: 'How far away is your intended program start date?',
    section: 'Docs & Timing',
    options: [
      { value: '4_months_plus', label: '4 months or more', points: 5 },
      { value: '2_to_3_months', label: '2-3 months away', points: 3 },
      { value: 'less_2_months', label: 'Less than 8 weeks away', points: 0 },
    ],
  },
  // Section E: Risk Flags
  {
    id: 'q10_visa_refusals',
    text: 'Have you ever had a visa refused for Canada or any other country?',
    section: 'Risk Flags',
    options: [
      { value: 'no', label: 'No refusals', points: 10 },
      { value: 'yes_resolved', label: 'Yes, but it was resolved with new information', points: 4 },
      { value: 'yes_unresolved', label: 'Yes, and it is unresolved or I have multiple refusals', points: 0 },
    ],
  },
  {
    id: 'q11_inadmissibility',
    text: 'Do you have any criminal record, serious medical condition, or deportation history?',
    section: 'Risk Flags',
    options: [
      { value: 'no', label: 'None', points: 5 },
      { value: 'yes_minor', label: 'Yes, but it is minor and well-documented', points: 2 },
      { value: 'yes_major', label: 'Yes, it is serious or the outcome is uncertain', points: 0 },
    ],
  },
  // Section F: Study Plan Fit
  {
    id: 'q12_program_fit',
    text: 'Does your chosen Canadian program clearly advance your current field or career goals?',
    section: 'Study Plan Fit',
    options: [
      { value: 'direct', label: 'Yes, it is a direct progression (e.g., BSc to MSc)', points: 10 },
      { value: 'related', label: 'It is related, but requires some explanation', points: 5 },
      { value: 'switch', label: 'It is a major career switch with no clear link', points: 0 },
    ],
  },
  {
    id: 'q13_home_ties',
    text: 'Do you have strong home-country ties (e.g., a job offer to return to, property, family business)?',
    section: 'Study Plan Fit',
    options: [
      { value: 'multiple', label: 'Yes, I have multiple strong ties', points: 5 },
      { value: 'some', label: 'I have some ties', points: 2 },
      { value: 'weak', label: 'My ties are weak or not easily proven', points: 0 },
    ],
  },
];

const sectionMaxPoints: Record<string, number> = {
    'Admission': 25,
    'Finances': 25,
    'Language': 15,
    'Docs & Timing': 10,
    'Risk Flags': 15,
    'Study Plan Fit': 15,
};

export function EligibilityQuizFlow() {
  const [answers, setAnswers] = useState<Answers>({});
  const [finished, setFinished] = useState(false);
  const { user } = useAuth();

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

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
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
    const sectionScores: Record<string, number> = {
        'Admission': 0, 'Finances': 0, 'Language': 0, 
        'Docs & Timing': 0, 'Risk Flags': 0, 'Study Plan Fit': 0
    };

    for (const q of questions) {
        if (answers[q.id]) {
            const answer = q.options.find(opt => opt.value === answers[q.id]);
            if (answer) {
                totalScore += answer.points;
                sectionScores[q.section] += answer.points;
            }
        }
    }
    return { totalScore, sectionScores };
  }
  
  const { totalScore, sectionScores } = calculateScores();

  useEffect(() => {
    if (finished && user?.uid) {
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
        }
      };
      saveResults();
    }
  }, [finished, user, totalScore, sectionScores, answers]);
  
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
            <CardTitle>Question {currentQuestionIndex + 1} of {visibleQuestions.length}</CardTitle>
            <Progress value={progressPercentage} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
            <p className="text-lg font-medium">{currentQuestion.text}</p>
            {currentQuestion.type === 'select' ? (
                <Select
                    value={currentAnswer || ''}
                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                        {currentQuestion.options.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ) : (
                <RadioGroup
                    value={currentAnswer || ''}
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
            <Button disabled={!currentAnswer}>
                Next
            </Button>
        </CardFooter>
    </Card>
  );
}
