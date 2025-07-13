
'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CollegeCard } from './college-card';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { WandSparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ReasoningPanel } from './reasoning-panel';
import { useApplication } from '@/context/application-context';


const mockColleges = [
    { dliNumber: 'O19332746152', name: 'University of Toronto', province: 'ON', city: 'Toronto', pgwpEligible: true, sdsEligible: true, tuitionLow: 57000, tuitionHigh: 69000, image: 'https://placehold.co/600x400.png', aiHint: 'university campus' },
    { dliNumber: 'O19425660302', name: 'University of British Columbia', province: 'BC', city: 'Vancouver', pgwpEligible: true, sdsEligible: true, tuitionLow: 49000, tuitionHigh: 64000, image: 'https://placehold.co/600x400.png', aiHint: 'modern architecture' },
    { dliNumber: 'O19391528447', name: 'McGill University', province: 'QC', city: 'Montreal', pgwpEligible: true, sdsEligible: true, tuitionLow: 29000, tuitionHigh: 53000, image: 'https://placehold.co/600x400.png', aiHint: 'historic building' },
    { dliNumber: 'O119441046457', name: 'University of Alberta', province: 'AB', city: 'Edmonton', pgwpEligible: true, sdsEligible: true, tuitionLow: 31000, tuitionHigh: 45000, image: 'https://placehold.co/600x400.png', aiHint: 'university building' },
    { dliNumber: 'O19359011021', name: 'Dalhousie University', province: 'NS', city: 'Halifax', pgwpEligible: true, sdsEligible: true, tuitionLow: 25000, tuitionHigh: 40000, image: 'https://placehold.co/600x400.png', aiHint: 'campus green' },
    { dliNumber: 'O19359201512', name: 'University of Manitoba', province: 'MB', city: 'Winnipeg', pgwpEligible: true, sdsEligible: true, tuitionLow: 18000, tuitionHigh: 28000, image: 'https://placehold.co/600x400.png', aiHint: 'university library' },
    { dliNumber: 'O19332543352', name: 'Algonquin College', province: 'ON', city: 'Ottawa', pgwpEligible: true, sdsEligible: true, tuitionLow: 16000, tuitionHigh: 19000, image: 'https://placehold.co/600x400.png', aiHint: 'college campus' },
    { dliNumber: 'O19305391192', name: 'George Brown College', province: 'ON', city: 'Toronto', pgwpEligible: true, sdsEligible: true, tuitionLow: 15000, tuitionHigh: 23000, image: 'https://placehold.co/600x400.png', aiHint: 'city college' },
    { dliNumber: 'O214383061827', name: 'Humber College', province: 'ON', city: 'Toronto', pgwpEligible: false, sdsEligible: true, tuitionLow: 17000, tuitionHigh: 22000, image: 'https://placehold.co/600x400.png', aiHint: 'modern college' },
    { dliNumber: 'O19395299688', name: 'Saskatchewan Polytechnic', province: 'SK', city: 'Saskatoon', pgwpEligible: true, sdsEligible: true, tuitionLow: 15000, tuitionHigh: 21000, image: 'https://placehold.co/600x400.png', aiHint: 'polytechnic institute' },
];


function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

function CollegeMatchPageContent() {
    const { applicationData } = useApplication();
    const [loading, setLoading] = useState(false);
    
    // State for filters
    const [province, setProvince] = useState('all');
    const [programType, setProgramType] = useState('all');
    const [maxTuition, setMaxTuition] = useState(70000);
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
    }

    const filteringLogic = `Filtered for ${programType !== 'all' ? programType : 'any program'} in ${province !== 'all' ? province : 'any province'} with tuition under ${formatCurrency(maxTuition)}.`;

    const studentProfile = {
      ...applicationData.personalInfo,
      ...applicationData.academics,
      ...applicationData.language,
      ...applicationData.finances,
    }

  return (
      <div className="grid flex-1 grid-cols-1 gap-8 p-4 md:grid-cols-4 md:p-8">
        <aside className="md:col-span-1">
          <Card className="sticky top-20 shadow-none border-none bg-transparent">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="font-bold text-lg">Filter Colleges</CardTitle>
              <CardDescription>Refine your search.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <form className="space-y-6" onSubmit={handleSearch}>
                <div className="space-y-2">
                  <Label htmlFor="province" className="text-xs">Province</Label>
                  <Select value={province} onValueChange={setProvince}>
                    <SelectTrigger id="province">
                      <SelectValue placeholder="All Provinces" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Provinces</SelectItem>
                      <SelectItem value="ON">Ontario</SelectItem>
                      <SelectItem value="BC">British Columbia</SelectItem>
                      <SelectItem value="QC">Quebec</SelectItem>
                      <SelectItem value="AB">Alberta</SelectItem>
                      <SelectItem value="NS">Nova Scotia</SelectItem>
                      <SelectItem value="MB">Manitoba</SelectItem>
                      <SelectItem value="SK">Saskatchewan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="program" className="text-xs">Program Type</Label>
                   <Select value={programType} onValueChange={setProgramType}>
                    <SelectTrigger id="program">
                      <SelectValue placeholder="All Programs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Programs</SelectItem>
                      <SelectItem value="undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="postgraduate">Postgraduate</SelectItem>
                       <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="certificate">Certificate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-4">
                  <Label className="text-xs">Max Tuition: <span className="font-semibold">{formatCurrency(maxTuition)}</span></Label>
                  <Slider
                    defaultValue={[70000]}
                    max={100000}
                    step={1000}
                    onValueChange={(value) => setMaxTuition(value[0])}
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        </aside>

        <main className="md:col-span-3">
            <Card className="mb-6 bg-primary/5 border-primary/20">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <WandSparkles className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-primary">AI Reasoning</CardTitle>
                            <CardDescription className="text-primary/80">
                            Understand why some colleges don&apos;t match your profile.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Dialog>
                      <DialogTrigger asChild>
                         <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"><WandSparkles className="mr-2 h-4 w-4" /> Explain Filtering</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>AI Reasoning for Excluded Colleges</DialogTitle>
                          <DialogDescription>
                            {`Based on your profile and filters (${programType}, ${province}, <${formatCurrency(maxTuition)}), here's why some colleges were not shown.`}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="font-semibold text-sm">UBC (Vancouver, BC)</div>
                          <ReasoningPanel dliDetails={{name: 'University of British Columbia', province: 'BC'}} filteringLogic={filteringLogic} studentProfile={studentProfile} />

                           <div className="font-semibold text-sm mt-4">McGill (Montreal, QC)</div>
                           <ReasoningPanel dliDetails={{name: 'McGill University', province: 'QC'}} filteringLogic={filteringLogic} studentProfile={studentProfile} />
                        </div>
                      </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            <div className="mb-4">
                <h1 className="font-bold text-xl">Matching DLIs ({loading ? '...' : mockColleges.length})</h1>
            </div>

            {loading ? (
                 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                            <Skeleton className="h-48 w-full" />
                            <div className="p-4">
                                <Skeleton className="h-5 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/4 mb-4" />
                                <div className="flex gap-2 mb-4">
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-6 w-24" />
                                </div>
                                <Skeleton className="h-6 w-32" />
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {mockColleges.map((college) => (
                        <CollegeCard key={college.dliNumber} college={college} />
                    ))}
                </div>
            )}
        </main>
      </div>
  );
}


export default function CollegeMatchPage() {
  return (
    <AppLayout>
      <CollegeMatchPageContent />
    </AppLayout>
  )
}
