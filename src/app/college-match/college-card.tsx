
'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, Sparkles, BookOpenCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

type College = {
  dliNumber: string;
  name: string;
  province: string;
  city: string;
  pgwpEligible: boolean;
  sdsEligible: boolean;
  tuitionLow: number;
  tuitionHigh: number;
  image: string;
  aiHint: string;
  programs: string[];
};

function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

export function CollegeCard({ college }: { college: College }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <div className="relative h-40 w-full bg-muted">
        <Image src={college.image} alt={college.name} layout="fill" objectFit="cover" data-ai-hint={college.aiHint} />
         <Badge className="absolute top-2 right-2" variant="secondary">{college.province}</Badge>
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-bold leading-tight">{college.name}</CardTitle>
        <CardDescription className="text-xs pt-1">
          {college.city}, {college.province} &middot; DLI# {college.dliNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between p-4 pt-2">
        <div>
            <div className="text-sm font-semibold text-foreground mb-2">
                {formatCurrency(college.tuitionLow)} - {formatCurrency(college.tuitionHigh)}
                <span className="text-xs font-normal text-muted-foreground"> / year</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs mb-4">
                <Badge variant={college.pgwpEligible ? "default" : "destructive"} className={cn("border-transparent", college.pgwpEligible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>
                    {college.pgwpEligible ? <CheckCircle2 className="h-3 w-3 mr-1.5" /> : <XCircle className="h-3 w-3 mr-1.5" />}
                    PGWP
                </Badge>
                 <Badge variant="secondary" className="border-transparent bg-blue-100 text-blue-800">
                    <Sparkles className="h-3 w-3 mr-1.5" />
                    SDS
                </Badge>
            </div>
            
            <Separator className="my-3" />

            <div>
                <h4 className="text-xs font-semibold mb-2 flex items-center">
                    <BookOpenCheck className="h-3 w-3 mr-1.5" />
                    Popular Programs
                </h4>
                <ul className="space-y-1">
                    {college.programs.slice(0, 3).map(program => (
                        <li key={program} className="text-xs text-muted-foreground">{program}</li>
                    ))}
                    {college.programs.length > 3 && <li className="text-xs text-muted-foreground">and more...</li>}
                </ul>
            </div>
        </div>

        <div className="flex items-center space-x-2 mt-4 pt-4 border-t">
          <Switch id={`favorite-${college.dliNumber}`} />
          <Label htmlFor={`favorite-${college.dliNumber}`} className="text-xs font-normal">Save to favorites</Label>
        </div>
      </CardContent>
    </Card>
  );
}

    