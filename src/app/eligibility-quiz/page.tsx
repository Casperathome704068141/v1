
'use client';

import { AppLayout } from '@/components/app-layout';
import { EligibilityQuizFlow } from '@/components/eligibility-quiz-flow';

export default function EligibilityQuizPage() {
  return (
    <AppLayout>
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">Eligibility Quiz</h1>
        </div>
        <EligibilityQuizFlow />
      </main>
    </AppLayout>
  );
}
