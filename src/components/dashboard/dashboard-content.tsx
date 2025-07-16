
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useUser } from '@/hooks/use-user';
import { ArrowRight, BrainCircuit, Check, Circle, UserCheck, Send, Fingerprint, Stethoscope, CheckCircle, CalendarCheck, GraduationCap, FileText, BadgeHelp } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useApplication } from '@/context/application-context';
import { format, formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '../ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';


const applicationStepsConfig = [
    { id: 'personalInfo', name: 'Profile Information', href: '/application?step=profile', icon: UserCheck },
    { id: 'academics', name: 'Academic & Work History', href: '/application?step=academics', icon: FileText },
    { id: 'language', name: 'Language Proficiency', href: '/application?step=language', icon: FileText },
    { id: 'finances', name: 'Financial Details', href: '/application?step=finances', icon: FileText },
    { id: 'studyPlan', name: 'Study Plan', href: '/application?step=plan', icon: FileText },
    { id: 'family', name: 'Family Information', href: '/application?step=family', icon: FileText },
    { id: 'background', name: 'Background & Security', href: '/application?step=background', icon: FileText },
    { id: 'documents', name: 'Upload Documents', href: '/application?step=documents', icon: FileText },
    // These are placeholders for the user journey after submission
    { name: 'Application Submission', icon: Send, completed: false },
    { name: 'Biometrics Completed', icon: Fingerprint, completed: false },
    { name: 'Medical Exam Passed', icon: Stethoscope, completed: false },
    { name: 'Passport Request', icon: Send, completed: false },
    { name: 'Visa Approved', icon: CheckCircle, completed: false },
];

const isStepCompleted = (stepId: keyof ReturnType<typeof useApplication>['applicationData'], applicationData: any) => {
    if (!stepId || !applicationData || !applicationData[stepId]) return false;
    
    const data = applicationData[stepId];

    if (typeof data === 'object' && data !== null && Object.keys(data).length === 0) {
        return false;
    }

    switch (stepId) {
        case 'personalInfo':
            return !!data.surname && !!data.givenNames && !!data.dob && !!data.passportNumber;
        case 'academics':
            return (data.educationHistory && data.educationHistory.length > 0) || (data.employmentHistory && data.employmentHistory.length > 0);
        case 'language':
            return data.testTaken !== 'none' ? !!data.overallScore : !!data.testPlanning;
        case 'finances':
            return !!data.totalFunds && data.fundingSources?.length > 0 && data.proofType?.length > 0;
        case 'studyPlan':
            return !!data.whyInstitution && !!data.howProgramFitsCareer;
        case 'family':
            return !!data.parent1Name;
        case 'background':
            return data.certification === true;
        case 'documents':
            const requiredDocs = ['passport', 'loa', 'proofOfFunds', 'languageTest', 'sop', 'photo'];
            return requiredDocs.every((docId: string) => data[docId]?.files?.length > 0);
        default:
            return false;
    }
};

interface Application {
    id: string;
    status: string;
    submittedAt?: { toDate: () => Date };
    [key: string]: any;
}

function getStatusBadgeVariant(status: string) {
    switch (status) {
        case 'submitted': return 'default';
        case 'pending': return 'secondary';
        case 'draft': return 'outline';
        case 'approved': return 'default';
        case 'rejected': return 'destructive';
        default: return 'outline';
    }
}

export function DashboardContent() {
  const { user } = useUser();
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const { applicationData: draftApplicationData, isLoaded: isDraftLoaded } = useApplication();

  useEffect(() => {
    async function fetchData() {
      if(user?.uid) {
        setLoading(true);
        
        const appsQuery = query(collection(db, 'users', user.uid, 'application'));
        const appsSnap = await getDocs(appsQuery);
        const appsData = appsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
        setAllApplications(appsData);

        const quizDocRef = doc(db, 'users', user.uid, 'quizResults', 'eligibility');
        const quizDocSnap = await getDoc(quizDocRef);
        if (quizDocSnap.exists()) {
          setQuizScore(quizDocSnap.data().score);
        }
        
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const journeySteps = applicationStepsConfig.map(step => ({
      ...step,
      completed: step.id ? isStepCompleted(step.id as any, draftApplicationData) : step.completed
  }));

  const filledApplicationSteps = journeySteps.filter(step => step.id);
  const completedStepsCount = filledApplicationSteps.filter(step => step.completed).length;
  const progressPercentage = filledApplicationSteps.length > 0 ? (completedStepsCount / filledApplicationSteps.length) * 100 : 0;
  const currentStepIndex = journeySteps.findIndex(step => !step.completed);
  const currentStep = currentStepIndex !== -1 ? journeySteps[currentStepIndex] : null;

  const { selectedCollege } = draftApplicationData;
  const chosenInstitution = selectedCollege?.name || 'Not Selected';
  const programOfChoice = draftApplicationData.studyPlan?.programChoice || 'Not Entered';
  
  const submittedApplications = allApplications.filter(app => app.status !== 'draft');

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
              <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                      <CardTitle>Your Journey Overview</CardTitle>
                      <CardDescription>You've completed {completedStepsCount} of {filledApplicationSteps.length} application steps. Let's keep going!</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                      <div className="flex items-center gap-4">
                          <Progress value={progressPercentage} className="h-2" />
                          <span className="text-sm font-semibold text-muted-foreground">{Math.round(progressPercentage)}%</span>
                      </div>
                      <div className="relative">
                          {journeySteps.map((step, index) => {
                              const isCompleted = step.completed;
                              const isCurrent = index === currentStepIndex;

                              return (
                              <div key={step.name} className="flex items-start gap-4 pb-8">
                                  {index < journeySteps.length - 1 && (
                                      <div className={cn("absolute left-4 top-5 -ml-px h-full w-0.5", isCompleted ? "bg-primary" : "bg-border")}></div>
                                  )}
                                  <div className={cn("relative z-10 flex h-8 w-8 items-center justify-center rounded-full", isCompleted ? 'bg-primary' : isCurrent ? 'bg-primary/20 border-2 border-primary' : 'bg-muted', isCurrent && "animate-pulse")}>
                                      {isCompleted ? <Check className="h-5 w-5 text-primary-foreground" /> : step.icon ? <step.icon className={cn("h-4 w-4", isCurrent ? "text-primary" : "text-muted-foreground")} /> : <Circle className={cn("h-3 w-3", isCurrent ? "text-primary fill-primary" : "text-muted-foreground fill-muted-foreground")} />}
                                  </div>
                                  <div className="flex-1 -mt-1.5">
                                       <div className="flex items-center justify-between">
                                          <p className={cn("font-medium", isCompleted ? "text-foreground" : isCurrent ? "text-primary font-semibold" : "text-muted-foreground")}>{step.name}</p>
                                          {step.href && (<Button asChild variant={isCurrent ? 'secondary' : 'ghost'} size="sm"><Link href={step.href}>{isCompleted ? 'Review' : isCurrent ? 'Continue' : 'Start'} <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>)}
                                       </div>
                                      {isCurrent && <p className="text-sm text-muted-foreground mt-1">This is your next step.</p>}
                                  </div>
                              </div>
                          )})}
                      </div>
                  </CardContent>
              </Card>
              
              {submittedApplications.length > 0 && (
                  <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                          <CardTitle>Submitted Applications</CardTitle>
                          <CardDescription>Track the status of your past submissions.</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <Table>
                              <TableHeader>
                                  <TableRow>
                                      <TableHead>Program</TableHead>
                                      <TableHead>Submitted</TableHead>
                                      <TableHead>Status</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {submittedApplications.map(app => (
                                      <TableRow key={app.id}>
                                          <TableCell className="font-medium">{app.studyPlan?.programChoice || 'N/A'}</TableCell>
                                          <TableCell>{app.submittedAt ? formatDistanceToNow(app.submittedAt.toDate(), { addSuffix: true }) : 'N/A'}</TableCell>
                                          <TableCell><Badge variant={getStatusBadgeVariant(app.status)}>{app.status}</Badge></TableCell>
                                      </TableRow>
                                  ))}
                              </TableBody>
                          </Table>
                      </CardContent>
                  </Card>
              )}
          </div>

          <div className="space-y-8 md:col-span-1">
               {currentStep && currentStep.href && (
                  <Card className="bg-primary/5 border-primary/20 hover:shadow-lg transition-shadow">
                      <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg text-primary"><ArrowRight className="h-5 w-5 text-primary" />Next Step: {currentStep.name}</CardTitle>
                          <CardDescription>Continue where you left off in your application.</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <Button asChild className="w-full"><Link href={currentStep.href}>Let's Go</Link></Button>
                      </CardContent>
                  </Card>
              )}
              
              <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><BadgeHelp className="h-5 w-5 text-primary" />Eligibility Score</CardTitle></CardHeader>
                  <CardContent>
                      {loading ? <Skeleton className="h-5 w-3/4" /> : (
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

              <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><GraduationCap className="h-5 w-5 text-primary" />Your Study Plan</CardTitle></CardHeader>
                  <CardContent>
                      <p className="font-semibold text-primary">{chosenInstitution}</p>
                      <p className="text-sm text-muted-foreground">{programOfChoice}</p>
                       <Button asChild variant="secondary" className="w-full mt-4">
                          <Link href="/college-match">Change College/Program</Link>
                      </Button>
                  </CardContent>
              </Card>
          </div>
      </div>
    </main>
  );
}
