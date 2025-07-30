
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
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

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
      pieColor: 'hsl(var(--success))',
    };
  }
  if (score >= 50) {
    return {
      status: 'Needs Improvement',
      description: '🔧 A few gaps to close before you apply. You have a good foundation to build upon.',
      ctaText: 'Start Your Application',
      ctaLink: '/application',
      ctaVariant: 'secondary' as const,
      pieColor: 'hsl(var(--warning))',
    };
  }
  return {
    status: 'High Risk',
    description: '⚠️ There may be a high refusal risk if you apply now. We recommend a consultation.',
    ctaText: 'Book a 1-on-1 Consultation',
    ctaLink: '/appointments',
    ctaVariant: 'destructive' as const,
    pieColor: 'hsl(var(--destructive))',
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
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

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
  
  const COLORS = [resultDetails.pieColor, 'hsl(var(--muted))'];
  
  const handleCtaClick = () => {
    router.push(resultDetails.ctaLink);
  }

  const handleActionPlanClick = () => {
    const answersQuery = encodeURIComponent(JSON.stringify(answers));
    const scoresQuery = encodeURIComponent(JSON.stringify(sectionScores));
    router.push(`/action-plan?answers=${answersQuery}&scores=${scoresQuery}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
        <Card className="max-w-4xl mx-auto overflow-hidden border-border/50 shadow-xl">
        <CardHeader className="text-center items-center bg-muted/30 p-8">
            <motion.div 
                className="relative h-48 w-48"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={85}
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
                    <span className="text-6xl font-black tracking-tighter">{totalScore}</span>
                    <span className="text-sm text-muted-foreground font-bold">/ 100</span>
                </div>
            </motion.div>

            <CardTitle className="text-4xl font-black tracking-tighter mt-4">{resultDetails.status}</CardTitle>
            <CardDescription className="max-w-md text-lg">
            {resultDetails.description}
            </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Score Breakdown</h3>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" width={120} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" className="font-semibold"/>
                        <Tooltip 
                            contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            }}
                            formatter={(value, name) => [`${value} / ${sectionMaxPoints[name as string]}`, 'Score']}
                        />
                        <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 4, 4]} barSize={25}>
                            <LabelList dataKey="score" position="right" offset={10} className="fill-foreground font-bold text-lg" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </CardContent>
        <CardFooter className="flex-col gap-4 border-t bg-muted/30 p-8">
            <Button onClick={handleActionPlanClick} size="lg" className="w-full text-lg py-7 bg-electric-violet hover:bg-[#8A2BE2]/90 font-bold">
                View Your AI-Generated Action Plan
            </Button>
            <Button onClick={handleCtaClick} size="lg" variant={resultDetails.ctaVariant} className="w-full text-lg py-7 font-bold">
                {resultDetails.ctaText}
            </Button>
            <Button variant="ghost" onClick={onReset} className="w-full text-base">
                Take the Quiz Again
            </Button>
        </CardFooter>
        </Card>
    </motion.div>
  );
}
