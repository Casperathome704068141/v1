
import { AdminLayout } from '@/components/admin/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart } from 'lucide-react';

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout>
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">Analytics</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart className="h-5 w-5 text-primary" />
                        Sign-ups Over Time
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Chart displaying user sign-ups will be here.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LineChart className="h-5 w-5 text-primary" />
                        Application Status Trends
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Chart showing application trends (approved, pending) will be here.</p>
                </CardContent>
            </Card>
        </div>

      </main>
    </AdminLayout>
  );
}
