'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CollegeCard } from './college-card';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const mockColleges = [
  { id: 1, name: 'University of Toronto', province: 'Ontario', city: 'Toronto', programs: ['Undergraduate', 'Postgraduate'], image: 'https://placehold.co/600x400.png', aiHint: 'university campus' },
  { id: 2, name: 'University of British Columbia', province: 'British Columbia', city: 'Vancouver', programs: ['Undergraduate', 'Postgraduate', 'Diploma'], image: 'https://placehold.co/600x400.png', aiHint: 'modern architecture' },
  { id: 3, name: 'McGill University', province: 'Quebec', city: 'Montreal', programs: ['Undergraduate', 'Postgraduate'], image: 'https://placehold.co/600x400.png', aiHint: 'historic building' },
  { id: 4, name: 'Seneca College', province: 'Ontario', city: 'Toronto', programs: ['Diploma', 'Certificate'], image: 'https://placehold.co/600x400.png', aiHint: 'college campus' },
  { id: 5, name: 'BCIT', province: 'British Columbia', city: 'Burnaby', programs: ['Diploma', 'Certificate'], image: 'https://placehold.co/600x400.png', aiHint: 'technology institute' },
  { id: 6, name: 'Concordia University', province: 'Quebec', city: 'Montreal', programs: ['Undergraduate', 'Postgraduate'], image: 'https://placehold.co/600x400.png', aiHint: 'city campus' },
];


export default function CollegeMatchPage() {
    const [loading, setLoading] = useState(false);
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
    }
  return (
    <AppLayout>
      <div className="grid flex-1 grid-cols-1 gap-8 p-4 md:grid-cols-4 md:p-8">
        <aside className="md:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="font-headline">Find Your College</CardTitle>
              <CardDescription>Use filters to find the perfect DLI for you.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSearch}>
                <div className="space-y-2">
                  <Label htmlFor="search">Keyword Search</Label>
                  <Input id="search" placeholder="e.g., 'Business', 'Toronto'" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
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
                  <Label>Program Type</Label>
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="undergraduate" />
                      <Label htmlFor="undergraduate" className="font-normal">Undergraduate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="postgraduate" />
                      <Label htmlFor="postgraduate" className="font-normal">Postgraduate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="diploma" />
                      <Label htmlFor="diploma" className="font-normal">Diploma</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="certificate" />
                      <Label htmlFor="certificate" className="font-normal">Certificate</Label>
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full font-semibold">Search</Button>
              </form>
            </CardContent>
          </Card>
        </aside>

        <main className="md:col-span-3">
            <div className="mb-4">
                <h1 className="font-headline text-3xl font-bold">Matching Colleges</h1>
                <p className="text-muted-foreground">
                    {loading ? 'Searching...' : `Showing ${mockColleges.length} results`}
                </p>
            </div>
            {loading ? (
                 <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i}>
                            <Skeleton className="h-[200px] w-full" />
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-10 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
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
