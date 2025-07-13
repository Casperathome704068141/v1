import { AppLayout } from '@/components/app-layout';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SupportPage() {
  return (
    <AppLayout>
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">Support</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              This page is under construction. Check back later for the support section!
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    </AppLayout>
  );
}
