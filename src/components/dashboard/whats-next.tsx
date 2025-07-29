
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { useApplication } from '@/context/application-context';
import { useUser } from '@/hooks/use-user';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const getNextAction = (applicationData, quizScore, hasAppointments) => {
    if (quizScore === null) {
        return {
            title: "Start Your Journey",
            description: "Take our free Eligibility Quiz to instantly see your application strength.",
            cta: "Take Quiz Now",
            href: "/eligibility-quiz",
        };
    }
    if (!applicationData?.personalInfo?.isComplete) {
        return {
            title: "Complete Your Profile",
            description: "Fill in your personal information to get more accurate college matches.",
            cta: "Go to Profile",
            href: "/application",
        };
    }
    if (!hasAppointments) {
        return {
            title: "Book a Consultation",
            description: "Schedule a meeting with an RCIC to discuss your application strategy.",
            cta: "Book Now",
            href: "/appointments",
        };
    }
    if (!applicationData.submittedAppId) {
        return {
            title: "Submit Your Application",
            description: "Finalize and submit your application for review by our experts.",
            cta: "Go to Application",
            href: "/application/review",
        };
    }
    return {
        title: "Application Submitted!",
        description: "Your application is under review. We will notify you of any updates.",
        cta: "View Status",
        href: "/dashboard",
    };
};

export function WhatsNext() {
    const { applicationData } = useApplication();
    const { user } = useUser();
    const [quizScore, setQuizScore] = useState<number | null>(null);
    const [hasAppointments, setHasAppointments] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (user?.uid) {
                const quizDocRef = doc(db, 'users', user.uid, 'quizResults', 'eligibility');
                const quizDocSnap = await getDoc(quizDocRef);
                setQuizScore(quizDocSnap.exists() ? quizDocSnap.data().score : null);

                const appointmentsRef = doc(db, 'users', user.uid);
                const appointmentsSnap = await getDoc(appointmentsRef);
                setHasAppointments(appointmentsSnap.exists() && appointmentsSnap.data().appointments?.length > 0);
                
                setLoading(false);
            }
        }
        fetchData();
    }, [user]);

    if (loading) {
        return null;
    }

    const nextAction = getNextAction(applicationData, quizScore, hasAppointments);

    return (
        <Card className="bg-gradient-to-r from-primary to-electric-violet text-primary-foreground shadow-2xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lightbulb /> What's Next?</CardTitle>
                <CardDescription className="text-primary-foreground/80">{nextAction.title}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-lg">{nextAction.description}</p>
                <Button asChild variant="secondary" className="mt-4 w-full sm:w-auto">
                    <Link href={nextAction.href}>{nextAction.cta} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </CardContent>
        </Card>
    );
}
