
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useUser } from '@/hooks/use-user';
import { ArrowRight, BadgeHelp, CalendarCheck, History, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { useApplication } from '@/context/application-context';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ApplicationProgress } from './application-progress';
import { ApplicationJourney } from './application-journey';
import { Progress } from '@/components/ui/progress';
import { WhatsNext } from './whats-next';
import { motion } from 'framer-motion';

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

function getStatusBadgeInfo(status: Appointment['status']) {
    switch (status) {
        case 'confirmed': return { variant: 'success', icon: CheckCircle, text: 'Confirmed' };
        case 'pending': return { variant: 'secondary', icon: Clock, text: 'Pending' };
        case 'declined': return { variant: 'destructive', icon: XCircle, text: 'Declined' };
        default: return { variant: 'outline', icon: Clock, text: 'Status' };
    }
}

function MyAppointments() {
    const { user } = useUser();
    const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.uid) { setLoading(false); return; }
        const q = query(collection(db, "appointments"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, snap => {
            setMyAppointments(snap.docs.map(d => ({id: d.id, ...d.data()}) as Appointment));
            setLoading(false);
        }, () => setLoading(false));
        return () => unsubscribe();
    }, [user]);

    return (
        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-card-foreground/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><CalendarCheck className="h-5 w-5 text-primary" />My Appointments</CardTitle>
                <CardDescription>Status of your appointment requests.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? <Skeleton className="h-12 w-full" /> : myAppointments.length > 0 ? (
                    <ul className="space-y-4">
                        {myAppointments.slice(0, 2).map(appt => {
                            const badge = getStatusBadgeInfo(appt.status);
                            return (
                                <li key={appt.id} className="text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">{appt.requestedDate} at {appt.requestedTime}</span>
                                        <Badge variant={badge.variant} className="capitalize"><badge.icon className="h-3 w-3 mr-1"/>{badge.text}</Badge>
                                    </div>
                                    {appt.status === 'declined' && appt.rejectionReason && (
                                        <p className="text-xs text-destructive mt-1">Reason: {appt.rejectionReason}</p>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No appointments scheduled.</p>
                )}
            </CardContent>
            <CardFooter>
                 <Button asChild variant="default" className="w-full bg-electric-violet hover:bg-electric-violet/90">
                    <Link href="/appointments">Manage Appointments <ArrowRight className="ml-2 h-4 w-4"/></Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

function ApplicationStatus() {
    const { isLoaded, applicationData } = useApplication();
    const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const submittedApplicationId = applicationData.submittedAppId;

    useEffect(() => {
        if (!isLoaded) return;
        if (!submittedApplicationId) { setLoading(false); return; }
        const q = query(collection(db, 'applications', submittedApplicationId, 'statusHistory'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setStatusHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StatusHistoryItem)));
            setLoading(false);
        }, () => setLoading(false));
        return () => unsubscribe;
    }, [submittedApplicationId, isLoaded]);

    if (!submittedApplicationId) {
        return <ApplicationProgress />;
    }

    if (!isLoaded || loading) {
        return <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>;
    }

    return (
        <Card className="bg-gradient-to-br from-card to-card-foreground/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><History className="h-5 w-5 text-primary" />Your Application Journey</CardTitle>
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

function EligibilityScoreCard() {
    const { user } = useUser();
    const [quizScore, setQuizScore] = useState<number | null>(null);
    const [loadingQuiz, setLoadingQuiz] = useState(true);

    useEffect(() => {
        async function fetchScore() {
            if(user?.uid) {
                setLoadingQuiz(true);
                const quizDocRef = doc(db, 'users', user.uid, 'quizResults', 'eligibility');
                const quizDocSnap = await getDoc(quizDocRef);
                setQuizScore(quizDocSnap.exists() ? quizDocSnap.data().score : null);
                setLoadingQuiz(false);
            }
        }
        fetchScore();
    }, [user]);

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><BadgeHelp className="h-5 w-5 text-primary" />Eligibility Score</CardTitle>
                 <CardDescription>Your estimated Canadian education eligibility.</CardDescription>
            </CardHeader>
            <CardContent>
                {loadingQuiz ? <Skeleton className="h-8 w-full" /> : (
                    quizScore != null ? (
                        <div className="space-y-2">
                             <p className="text-4xl font-black">{quizScore}<span className="text-lg font-normal text-muted-foreground">/100</span></p>
                            <Progress value={quizScore} className="w-full" />
                        </div>
                    ) : (
                        <p className="text-muted-foreground">Take the quiz to calculate your score.</p>
                    )
                )}
            </CardContent>
            <CardFooter>
                 <Button asChild variant="secondary" className="w-full mt-4">
                    <Link href="/eligibility-quiz">{quizScore != null ? 'Retake Quiz' : 'Take Quiz Now'}</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export function DashboardContent() {
  const { user } = useUser();

  return (
    <motion.main 
        className="flex-1 space-y-8 p-4 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
      <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter">
              Welcome back, {user?.displayName?.split(' ')[0] || 'Student'}!
          </h1>
          <p className="text-lg text-muted-foreground">
              Let's continue your journey to studying in Canada. Here's your dashboard.
          </p>
      </div>
      
      <WhatsNext />

      <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
             <ApplicationStatus />
          </div>

          <div className="space-y-8 lg:col-span-1">
              <MyAppointments />
              <EligibilityScoreCard />
          </div>
      </div>
    </motion.main>
  );
}
