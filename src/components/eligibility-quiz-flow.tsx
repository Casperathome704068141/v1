
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

const questions = [
  {
    id: 'loa',
    text: 'Have you received a Letter of Acceptance (LOA) from a Designated Learning Institution (DLI) in Canada?',
    failMessage: 'A Letter of Acceptance from a DLI is required to apply for a study permit.',
  },
  {
    id: 'funds',
    text: 'Can you prove you have enough money to pay for your tuition fees, living expenses, and return transportation?',
    failMessage: 'Proof of financial support is a critical requirement for a study permit.',
  },
  {
    id: 'criminality',
    text: 'Are you free of any criminal convictions or immigration-related offenses?',
    failMessage: 'You must be admissible to Canada. Criminal or immigration offenses can make you inadmissible.',
  },
   {
    id: 'intent',
    text: 'Do you intend to leave Canada at the end of your study period?',
    failMessage: 'You must satisfy an officer that you will leave Canada at the end of your studies.',
  },
];

type Answers = {
  [key: string]: 'yes' | 'no' | null;
};

export function EligibilityQuizFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    loa: null,
    funds: null,
    criminality: null,
    intent: null,
  });
  const [result, setResult] = useState<'eligible' | 'ineligible' | null>(null);

  const handleAnswerChange = (value: 'yes' | 'no') => {
    const currentQuestionId = questions[currentStep].id;
    setAnswers({ ...answers, [currentQuestionId]: value });
  };

  const handleNext = () => {
    const currentQuestion = questions[currentStep];
    const answer = answers[currentQuestion.id];

    if (answer === 'no') {
      setResult('ineligible');
      return;
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setResult('eligible');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({ loa: null, funds: null, criminality: null, intent: null });
    setResult(null);
  };

  const progressPercentage = ((currentStep + 1) / questions.length) * 100;
  const currentQuestion = questions[currentStep];
  const currentAnswer = answers[currentQuestion.id];

  if (result) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          {result === 'eligible' ? (
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          ) : (
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
          )}
          <CardTitle className="mt-4">
            {result === 'eligible' ? 'Congratulations!' : 'There might be an issue.'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {result === 'eligible' ? (
            <p className="text-muted-foreground">
              Based on your answers, you likely meet the basic requirements for a study permit. You can now proceed with your application.
            </p>
          ) : (
            <p className="text-muted-foreground">
                You answered "No" to a critical question. {questions.find(q => answers[q.id] === 'no')?.failMessage}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            {result === 'eligible' && (
                <Button asChild className="w-full">
                    <Link href="/application">Start Your Application</Link>
                </Button>
            )}
            <Button variant="outline" onClick={handleReset} className="w-full">
                Take the Quiz Again
            </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Question {currentStep + 1} of {questions.length}</CardTitle>
            <Progress value={progressPercentage} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-lg font-medium">{currentQuestion.text}</p>
            <RadioGroup
            value={currentAnswer || ''}
            onValueChange={handleAnswerChange}
            className="space-y-2"
            >
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes" className="text-base">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no" className="text-base">No</Label>
            </div>
            </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button onClick={handleNext} disabled={!currentAnswer}>
                {currentStep === questions.length - 1 ? 'Finish' : 'Next'}
            </Button>
        </CardFooter>
    </Card>
  );
}
