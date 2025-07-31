'use client';
import { AppLayout } from '@/components/app-layout';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { learningModules, LearningModule } from '@/lib/learning-modules';

export default function LearningHubPage() {
  const [active, setActive] = useState<LearningModule | null>(null);
  const [answered, setAnswered] = useState<{[id:string]:boolean}>({});

  const handleAnswer = (moduleId: string, correct: boolean) => {
    setAnswered(prev => ({ ...prev, [moduleId]: correct }));
  };

  return (
    <AppLayout>
      <main className="flex-1 p-4 md:p-8 space-y-6">
        <h1 className="text-3xl font-bold">Learning Hub</h1>
        {!active && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {learningModules.map(m => (
              <Card key={m.id} className="cursor-pointer hover:shadow-lg" onClick={() => setActive(m)}>
                <CardHeader>
                  <CardTitle>{m.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{m.content}</p>
                  {answered[m.id] && <p className="mt-2 text-success font-semibold">Badge Earned!</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {active && (
          <div className="space-y-4">
            <Button variant="ghost" onClick={() => setActive(null)}>Back to Modules</Button>
            <Card>
              <CardHeader>
                <CardTitle>{active.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{active.content}</p>
                {active.quiz.map((q, idx) => (
                  <div key={idx} className="space-y-2">
                    <p className="font-medium">{q.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {q.options.map((opt, oIdx) => (
                        <Button key={oIdx} variant="outline" onClick={() => handleAnswer(active.id, oIdx === q.answer)}>
                          {opt}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </AppLayout>
  );
}
