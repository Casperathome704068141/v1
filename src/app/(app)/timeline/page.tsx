
'use client';

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
    return (
        <Card className="bg-surface1 border-white/10">
            <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-48 w-full" />
            </CardContent>
        </Card>
    );
  }

  if (!applicationData.submittedAppId) {
    return (
        <Card className="bg-surface1 border-white/10 text-center py-12">
            <CardContent>
                <p className="text-slateMuted">Submit your application to view your timeline.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="bg-surface1 border-white/10">
      <CardHeader>
        <CardTitle className="font-display">Application Timeline</CardTitle>
        <CardDescription className="text-slateMuted">Your milestone history</CardDescription>
      </CardHeader>
      <CardContent>
        <ApplicationJourney currentStatus={history.length > 0 ? history[0].status : 'Pending Review'} statusHistory={history} />
      </CardContent>
    </Card>
  );
}

export default function TimelinePage() {
  return (
    <main className="flex-1 p-4 md:p-8">
      <TimelineContent />
    </main>
  );
}
