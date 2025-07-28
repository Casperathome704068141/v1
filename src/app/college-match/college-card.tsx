
'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Sparkles, BookOpenCheck, WandSparkles, AlertCircle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ReasoningPanel } from './reasoning-panel';
import type { College } from '@/lib/college-data';
import Link from 'next/link';
import { useApplication } from '@/context/application-context';

function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

interface CollegeCardProps {
    college: College;
    studentProfile: object;
    filteringLogic: string;
    isMatch: boolean;
    reason?: string;
}

export function CollegeCard({ college, studentProfile, filteringLogic, isMatch, reason }: CollegeCardProps) {
  const { applicationData } = useApplication();
  const isSelected = applicationData.selectedCollege?.dliNumber === college.dliNumber;
  
  const selectionUrl = `/application/select-program?college=${encodeURIComponent(JSON.stringify(college))}`;

  return (
    <Card className={cn(
        "flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl relative group", 
        !isMatch && "opacity-60 hover:opacity-100",
        isSelected && "border-2 border-primary ring-4 ring-primary/20"
    )}>
       {isSelected && (
          <Badge className="absolute top-3 left-3 z-10" variant="default">
            <CheckCircle2 className="h-3 w-3 mr-1.5" />
            Selected
          </Badge>
        )}
      <div className="relative h-48 w-full overflow-hidden">
        <Image 
          src={college.image} 
          alt={college.name} 
          layout="fill" 
          objectFit="cover" 
          data-ai-hint={college.aiHint}
          className="transition-transform duration-500 group-hover:scale-105"
        />
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
         <Badge className="absolute top-3 right-3" variant="secondary">{college.province}</Badge>
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-bold leading-tight font-headline">{college.name}</CardTitle>
        <CardDescription className="text-xs pt-1">
          {college.city}, {college.province} &middot; DLI# {college.dliNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between p-4 pt-2">
        <div className="flex-grow">
            <div className="text-sm font-semibold text-foreground mb-3">
                {formatCurrency(college.tuitionLow)} – {formatCurrency(college.tuitionHigh)}
                <span className="text-xs font-normal text-muted-foreground"> / year</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs mb-4">
                <Badge variant={college.pgwpEligible ? "success" : "destructive"}>
                    {college.pgwpEligible ? <CheckCircle2 className="h-3 w-3 mr-1.5" /> : <XCircle className="h-3 w-3 mr-1.5" />}
                    PGWP
                </Badge>
                 <Badge variant="outline">
                    <Sparkles className="h-3 w-3 mr-1.5 text-yellow-500" />
                    SDS Eligible
                </Badge>
            </div>
            
            <Separator className="my-4" />

            <div>
                <h4 className="text-xs font-semibold mb-2 flex items-center">
                    <BookOpenCheck className="h-4 w-4 mr-1.5 text-muted-foreground" />
                    Popular Programs
                </h4>
                <ul className="space-y-1.5">
                    {college.programs.slice(0, 3).map(program => (
                        <li key={program} className="text-xs text-muted-foreground">{program}</li>
                    ))}
                </ul>
            </div>
        </div>

        <div className="flex flex-col space-y-2 mt-4 pt-4 border-t">
            {isMatch ? (
                <Button asChild className="w-full" variant={isSelected ? "secondary" : "default"}>
                    <Link href={selectionUrl}>
                        <Send className="h-4 w-4 mr-2" />
                        {isSelected ? 'Change Program' : 'Select & Continue'}
                    </Link>
                </Button>
            ) : (
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive w-full">
                            <WandSparkles className="h-3 w-3 mr-1.5" /> Why wasn't this matched?
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                             <DialogTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-destructive" />
                                AI Matching Analysis
                            </DialogTitle>
                            <DialogDescription>
                               Based on your current profile, here is why {college.name} was not a primary recommendation.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <ReasoningPanel 
                                dliDetails={{ name: college.name, province: college.province, tuition: college.tuitionHigh }} 
                                filteringLogic={filteringLogic} 
                                studentProfile={studentProfile} 
                                initialReasoning={reason || ''}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
