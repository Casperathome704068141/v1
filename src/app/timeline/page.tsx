'use client';

import { AppLayout } from '@/components/app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useApplication } from '@/context/application-context';
import { useEffect, useState } from 'react';
import { ApplicationJourney } from '@/components/dashboard/application-journey';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

interface StatusHistoryItem {
  id: string;
  status: string;
  notes: string;
  timestamp: any;
  updatedBy: string;
}

function TimelineContent() {
  const { isLoaded, applicationData } = useApplication();
  const [history, setHistory] = useState<StatusHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    const submittedId = applicationData.submittedAppId;
    if (!submittedId) { setLoading(false); return; }
    const q = query(collection(db, 'applications', submittedId, 'statusHistory'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() } as StatusHistoryItem)));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [isLoaded, applicationData.submittedAppId]);

  if (!isLoaded || loading) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (!applicationData.submittedAppId) {
    return <p className="text-center text-muted-foreground">Submit your application to see timeline.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Timeline</CardTitle>
        <CardDescription>Your milestone history</CardDescription>
      </CardHeader>
      <CardContent>
        <ApplicationJourney currentStatus={history.length > 0 ? history[0].status : 'Pending Review'} statusHistory={history} />
      </CardContent>
    </Card>
  );
}

export default function TimelinePage() {
  return (
    <AppLayout>
      <main className="flex-1 p-4 md:p-8">
        <TimelineContent />
      </main>
    </AppLayout>
  );
}
