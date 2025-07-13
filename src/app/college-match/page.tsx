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


const mockColleges = [
  { id: 1, name: 'University of Toronto', province: 'ON', city: 'Toronto', programs: ['Engineering', 'Arts'], image: 'https://placehold.co/600x400.png', aiHint: 'university campus', tuition: 45000 },
  { id: 2, name: 'University of British Columbia', province: 'BC', city: 'Vancouver', programs: ['Computer Science', 'Business'], image: 'https://placehold.co/600x400.png', aiHint: 'modern architecture', tuition: 40000 },
  { id: 3, name: 'McGill University', province: 'QC', city: 'Montreal', programs: ['Arts', 'Science'], image: 'https://placehold.co/600x400.png', aiHint: 'historic building', tuition: 25000 },
  { id: 4, name: 'Seneca College', province: 'ON', city: 'Toronto', programs: ['Diploma', 'Certificate'], image: 'https://placehold.co/600x400.png', aiHint: 'college campus', tuition: 18000 },
  { id: 5, name: 'BCIT', province: 'BC', city: 'Burnaby', programs: ['Technology', 'Trades'], image: 'https://placehold.co/600x400.png', aiHint: 'technology institute', tuition: 22000 },
  { id: 6, name: 'Concordia University', province: 'QC', city: 'Montreal', programs: ['Fine Arts', 'Communication'], image: 'https://placehold.co/600x400.png', aiHint: 'city campus', tuition: 28000 },
];

function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}


export default function CollegeMatchPage() {
    const [loading, setLoading] = useState(false);
    const [tuition, setTuition] = useState([50000]);
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
    }
  return (
    <AppLayout>
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
                  <Select>
                    <SelectTrigger id="province">
                      <SelectValue placeholder="All Provinces" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ON">Ontario</SelectItem>
                      <SelectItem value="BC">British Columbia</SelectItem>
                      <SelectItem value="QC">Quebec</SelectItem>
                      <SelectItem value="AB">Alberta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="program" className="text-xs">Program Type</Label>
                   <Select>
                    <SelectTrigger id="program">
                      <SelectValue placeholder="All Programs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="postgraduate">Postgraduate</SelectItem>
                       <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="certificate">Certificate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-4">
                  <Label className="text-xs">Max Tuition: <span className="font-semibold">{formatCurrency(tuition[0])}</span></Label>
                  <Slider
                    defaultValue={[50000]}
                    max={100000}
                    step={1000}
                    onValueChange={(value) => setTuition(value)}
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
                            Based on your profile (Postgrad Diploma, Ontario, &lt;$20k), here&apos;s why some colleges were not shown.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="font-semibold text-sm">UBC (Vancouver, BC)</div>
                          <ReasoningPanel dliDetails={{name: 'University of British Columbia', province: 'BC'}} />

                           <div className="font-semibold text-sm mt-4">McGill (Montreal, QC)</div>
                           <ReasoningPanel dliDetails={{name: 'McGill University', province: 'QC'}} />
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
                        <CollegeCard key={college.id} college={college} />
                    ))}
                </div>
            )}
        </main>
      </div>
    </AppLayout>
  );
}
