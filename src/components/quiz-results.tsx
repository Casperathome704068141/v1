
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList, Tooltip } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface QuizResultsProps {
  totalScore: number;
  sectionScores: Record<string, number>;
  sectionMaxPoints: Record<string, number>;
  answers: Record<string, string | null | string[]>;
  onReset: () => void;
}

const getResultDetails = (score: number) => {
  if (score >= 75) {
    return {
      status: 'Application-Ready',
      description: '🎉 You’re in great shape! Start assembling docs and get ready to apply.',
      ctaText: 'Create Your Application',
      ctaLink: '/application',
      ctaVariant: 'default' as const,
    };
  }
  if (score >= 50) {
    return {
      status: 'Needs Improvement',
      description: '🔧 A few gaps to close before you apply. You have a good foundation to build upon.',
      ctaText: 'Start Your Application',
      ctaLink: '/application',
      ctaVariant: 'secondary' as const,
    };
  }
  return {
    status: 'High Risk',
    description: '⚠️ There may be a high refusal risk if you apply now. We recommend a consultation.',
    ctaText: 'Book a 1-on-1 Consultation',
    ctaLink: '/appointments',
    ctaVariant: 'destructive' as const,
  };
};

export function QuizResults({
  totalScore,
  sectionScores,
  sectionMaxPoints,
  answers,
  onReset,
}: QuizResultsProps) {
  const resultDetails = getResultDetails(totalScore);
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const saveScore = async () => {
      if (user?.uid) {
        try {
          const quizResultRef = doc(db, 'users', user.uid, 'quizResults', 'eligibility');
          await setDoc(quizResultRef, {
            score: totalScore,
            takenAt: serverTimestamp(),
          }, { merge: true });
        } catch (error) {
          console.error("Failed to save quiz score:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not save your quiz score."
          });
        }
      }
    };
    saveScore();
  }, [user, totalScore, toast]);


  const chartData = Object.keys(sectionScores).map(section => ({
    name: section,
    score: sectionScores[section],
    maxScore: sectionMaxPoints[section],
  }));

  const pieData = [
    { name: 'Score', value: totalScore },
    { name: 'Remaining', value: 100 - totalScore },
  ];
  
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))'];
  
  const handleCtaClick = () => {
    router.push(resultDetails.ctaLink);
  }

  const handleActionPlanClick = () => {
    const answersQuery = encodeURIComponent(JSON.stringify(answers));
    const scoresQuery = encodeURIComponent(JSON.stringify(sectionScores));
    router.push(`/action-plan?answers=${answersQuery}&scores=${scoresQuery}`);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center items-center">
        <div className="relative h-40 w-40">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={70}
                    startAngle={90}
                    endAngle={450}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                >
                    {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-4xl font-bold">{totalScore}</span>
                <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
        </div>

        <CardTitle className="text-2xl mt-4">{resultDetails.status}</CardTitle>
        <CardDescription className="max-w-md">
          {resultDetails.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-4 text-center">Score Breakdown</h3>
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={100} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                         contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)",
                        }}
                        formatter={(value, name) => [`${value} / ${sectionMaxPoints[name as string]}`, 'Score']}
                    />
                    <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 4, 4]} barSize={20}>
                        <LabelList dataKey="score" position="right" offset={10} className="fill-foreground font-semibold" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4 border-t pt-6">
        <Button onClick={handleCtaClick} size="lg" variant={resultDetails.ctaVariant} className="w-full">
          {resultDetails.ctaText}
        </Button>
        <Button variant="secondary" onClick={handleActionPlanClick} className="w-full">
          View Your AI-Generated Action Plan
        </Button>
        <Button variant="outline" onClick={onReset} className="w-full">
          Take the Quiz Again
        </Button>
      </CardFooter>
    </Card>
  );
}
