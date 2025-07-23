
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useUser } from '@/hooks/use-user';
import { ArrowRight, BadgeHelp, CalendarCheck, History } from 'lucide-react';
import Link from 'next/link';
import { useApplication } from '@/context/application-context';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ApplicationProgress } from './application-progress';
import { ApplicationJourney } from './application-journey';

type Appointment = {
    id: string;
    requestedDate: string;
    requestedTime: string;
    status: 'pending' | 'confirmed' | 'declined';
    rejectionReason?: string;
};

type StatusHistoryItem = {
    id: string;
    status: string;
    notes: string;
    timestamp: any;
    updatedBy: string;
}

function getStatusBadgeVariant(status: Appointment['status']) {
    switch (status) {
        case 'confirmed': return 'success';
        case 'pending': return 'secondary';
        case 'declined': return 'destructive';
        default: return 'outline';
    }
}

function MyAppointments() {
    const { user } = useUser();
    const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.uid) {
            setLoading(false);
            return;
        }

        const myApptsQ = query(
          collection(db, "appointments"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(myApptsQ, snap => {
            const appts = snap.docs.map(d => ({id: d.id, ...d.data()}) as Appointment);
            setMyAppointments(appts);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching appointments:", error);
            setLoading(false);
        });
        
        return () => unsubscribe();

    }, [user]);

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><CalendarCheck className="h-5 w-5 text-primary" />My Appointments</CardTitle>
                <CardDescription>The status of your appointment requests.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? <Skeleton className="h-10 w-full" /> : myAppointments.length > 0 ? (
                    <ul className="space-y-3">
                        {myAppointments.slice(0, 3).map(appt => (
                            <li key={appt.id} className="text-sm border-b pb-2 last:border-b-0 last:pb-0">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">{appt.requestedDate}</span>
                                    <Badge variant={getStatusBadgeVariant(appt.status)} className="capitalize">{appt.status}</Badge>
                                </div>
                                <p className="text-muted-foreground">{appt.requestedTime}</p>
                                {appt.status === 'declined' && appt.rejectionReason && (
                                    <p className="text-xs text-destructive mt-1">Reason: {appt.rejectionReason}</p>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">You have no appointment requests.</p>
                )}
            </CardContent>
            <CardFooter>
                 <Button asChild variant="secondary" className="w-full">
                    <Link href="/appointments">Request a New Appointment</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

function ApplicationStatus() {
    const { isLoaded, applicationData } = useApplication();
    const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const submittedApplicationId = applicationData.submittedAppId;

    useEffect(() => {
        if (!isLoaded) return;
        
        if (!submittedApplicationId) {
            setLoading(false);
            return;
        }

        const historyRef = collection(db, 'applications', submittedApplicationId, 'statusHistory');
        const q = query(historyRef, orderBy('timestamp', 'desc'));
        
        const unsubscribeHistory = onSnapshot(q, (snapshot) => {
            const history: StatusHistoryItem[] = [];
            snapshot.forEach(doc => {
                history.push({ id: doc.id, ...doc.data() } as StatusHistoryItem);
            });
            setStatusHistory(history);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching status history:", err);
            setError("Could not load application status.");
            setLoading(false);
        });

        return () => unsubscribeHistory();

    }, [submittedApplicationId, isLoaded]);

    if (!submittedApplicationId) {
        return <ApplicationProgress />;
    }

    if (!isLoaded || loading) {
        return (
             <Card>
                <CardHeader><CardTitle>Your Application Journey</CardTitle><CardDescription>Updates from our team will appear here.</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-4/5" />
                </CardContent>
            </Card>
        );
    }
    
     if (error) {
        return <p className="text-destructive">{error}</p>
     }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    Your Application Journey
                </CardTitle>
                <CardDescription>
                    {statusHistory.length > 0 ? `Current Status: ${statusHistory[0].status}` : 'Your application has been submitted!'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ApplicationJourney 
                    currentStatus={statusHistory.length > 0 ? statusHistory[0].status : 'Pending Review'} 
                    statusHistory={statusHistory} 
                />
            </CardContent>
        </Card>
    )
}

export function DashboardContent() {
  const { user } = useUser();
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if(user?.uid) {
        setLoadingQuiz(true);
        
        const quizDocRef = doc(db, 'users', user.uid, 'quizResults', 'eligibility');
        const quizDocSnap = await getDoc(quizDocRef);
        if (quizDocSnap.exists()) {
          setQuizScore(quizDocSnap.data().score);
        }
        setLoadingQuiz(false);
      }
    }
    fetchData();
  }, [user]);

  return (
    <main className="flex-1 space-y-8 p-4 md:p-8">
      <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.displayName?.split(' ')[0] || 'Student'}!
          </h1>
          <p className="text-muted-foreground">
              Let's continue your journey to studying in Canada. Here's your dashboard.
          </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
             <ApplicationStatus />
          </div>

          <div className="space-y-8 md:col-span-1">
              <MyAppointments />
              
              <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><BadgeHelp className="h-5 w-5 text-primary" />Eligibility Score</CardTitle></CardHeader>
                  <CardContent>
                      {loadingQuiz ? <Skeleton className="h-5 w-3/4" /> : (
                        quizScore != null ? (
                          <p className="font-semibold text-muted-foreground">Last Score: <span className="font-bold text-foreground">{quizScore}/100</span></p>
                        ) : (
                          <p className="text-muted-foreground">Take the quiz to see your score.</p>
                        )
                      )}
                      <Button asChild variant="secondary" className="w-full mt-4">
                        <Link href="/eligibility-quiz">{quizScore != null ? 'Retake Quiz' : 'Take Quiz'}</Link>
                      </Button>
                  </CardContent>
              </Card>
          </div>
      </div>
    </main>
  );
}
