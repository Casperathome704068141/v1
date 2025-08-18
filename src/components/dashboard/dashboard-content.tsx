
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useUser } from '@/hooks/use-user';
import { ArrowRight, BadgeHelp, CalendarCheck, History, CheckCircle, XCircle, Clock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useApplication } from '@/context/application-context';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ApplicationJourney } from './application-journey';
import { Progress } from '@/components/ui/progress';
import { WhatsNext } from './whats-next';
import { motion } from 'framer-motion';

// --- Existing Child Components (MyAppointments, MessagesPanel, etc.) ---
// These components remain unchanged. For brevity, I'll omit their code here,
// assuming they are defined in the same file or imported.

type Appointment = {
    id: string;
    requestedDate: string;
    requestedTime: string;
    status: 'pending' | 'confirmed' | 'declined';
    rejectionReason?: string;
};

type UserMessage = {
    id: string;
    text: string;
    sentAt: any;
    sender: string;
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
        <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><CalendarCheck className="h-5 w-5 text-primary" />Appointments</CardTitle>
                <CardDescription>Your upcoming meetings.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
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
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No appointments scheduled.</p>
                )}
            </CardContent>
            <CardFooter>
                 <Button asChild variant="default" className="w-full">
                    <Link href="/appointments">Manage Appointments <ArrowRight className="ml-2 h-4 w-4"/></Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

function MessagesPanel() {
    const { user } = useUser();
    const [messages, setMessages] = useState<UserMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.uid) { setLoading(false); return; }
        const q = query(collection(db, 'users', user.uid, 'messages'), orderBy('sentAt', 'desc'));
        const unsubscribe = onSnapshot(q, snap => {
            setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() }) as UserMessage));
            setLoading(false);
        }, () => setLoading(false));
        return () => unsubscribe();
    }, [user]);

    return (
        <Card className="hover:shadow-lg transition-shadow h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Mail className="h-5 w-5 text-primary" />Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? <Skeleton className="h-12 w-full" /> : messages.length > 0 ? (
                    <ul className="space-y-2 text-sm">
                        {messages.slice(0,3).map(m => (
                            <li key={m.id} className="truncate">{m.text}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">No new messages.</p>
                )}
            </CardContent>
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
    
    // The component now returns null if application is not submitted,
    // as the progress is handled by the WhatsNext component.
    if (!submittedApplicationId) return null;

    if (!isLoaded || loading) {
        return <Card className="col-span-1 md:col-span-2"><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>;
    }

    return (
        <Card className="col-span-1 md:col-span-2 row-span-1 md:row-span-2 hover:shadow-lg transition-shadow h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><History className="h-5 w-5 text-primary" />Your Application Journey</CardTitle>
                <CardDescription>
                    {statusHistory.length > 0 ? `Current Status: ${statusHistory[0].status}` : 'Your application has been submitted!'}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
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
        <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><BadgeHelp className="h-5 w-5 text-primary" />Eligibility Score</CardTitle>
                 <CardDescription>Your estimated eligibility.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-center">
                {loadingQuiz ? <Skeleton className="h-12 w-full" /> : (
                    quizScore != null ? (
                        <div className="space-y-2 w-full">
                             <p className="text-5xl font-black text-center">{quizScore}<span className="text-lg font-normal text-muted-foreground">/100</span></p>
                            <Progress value={quizScore} className="w-full" />
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center w-full">Take the quiz to find out your score.</p>
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

// --- Main Dashboard Content Component ---

export function DashboardContent() {
  const { user, profile } = useUser();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <main className="flex-1 space-y-8 p-4 md:p-8">
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
          <h1 className="text-4xl font-black tracking-tighter">
              Welcome back, {user?.displayName?.split(' ')[0] || 'Student'}!
          </h1>
          <p className="text-lg text-muted-foreground">
              Here's a snapshot of your journey to studying in Canada.
          </p>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Large item taking up significant space */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
            <WhatsNext />
        </motion.div>

        {/* Smaller item */}
        <motion.div variants={itemVariants}>
            <EligibilityScoreCard />
        </motion.div>

        {/* Application status, only shows if submitted */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
            <ApplicationStatus />
        </motion.div>
        
        <motion.div variants={itemVariants}>
            <MyAppointments />
        </motion.div>
        
        <motion.div variants={itemVariants} className="lg:col-span-3">
            <MessagesPanel />
        </motion.div>

      </motion.div>
    </main>
  );
}
