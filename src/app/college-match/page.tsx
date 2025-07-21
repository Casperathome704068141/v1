'use client';

import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CollegeCard } from './college-card';
import { useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { useApplication } from '@/context/application-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { findColleges, FindCollegesOutput } from '@/ai/flows/find-colleges';
import type { College } from '@/lib/college-data';
import { WandSparkles, Search } from 'lucide-react';

function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

function CollegeResults({ title, colleges, studentProfile, filteringLogic, searchTerm }: { title: string, colleges: College[], studentProfile: any, filteringLogic: string, searchTerm: string }) {
    const filteredColleges = useMemo(() => {
        if (!searchTerm) return colleges;
        return colleges.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [colleges, searchTerm]);

    if (!colleges || colleges.length === 0 || filteredColleges.length === 0) {
        return null;
    }

    return (
        <div className="mb-12">
            <h2 className="font-bold text-xl">{title} ({filteredColleges.length})</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                {filteredColleges.map((college) => (
                    <CollegeCard 
                        key={college.dliNumber} 
                        college={college} 
                        studentProfile={studentProfile}
                        filteringLogic={filteringLogic}
                        isMatch={true}
                    />
                ))}
            </div>
        </div>
    );
}

function CollegeMatchPageContent() {
    const { applicationData } = useApplication();
    
    // Form state
    const [province, setProvince] = useState('all');
    const [fieldOfInterest, setFieldOfInterest] = useState('');
    const studentBudget = applicationData.finances?.totalFunds;
    const [maxTuition, setMaxTuition] = useState(studentBudget || 50000);

    // AI results state
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<FindCollegesOutput | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResults(null);
        try {
            const aiResults = await findColleges({ province, maxTuition, fieldOfInterest });
            setResults(aiResults);
        } catch (err) {
            console.error("AI matching error:", err);
            setError("Sorry, we couldn't find matches at this time. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filteringLogic = `Filtered for ${fieldOfInterest} in ${province !== 'all' ? province : 'any province'} with tuition under ${formatCurrency(maxTuition)}.`;

    return (
      <div className="flex-1 space-y-8 p-4 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><WandSparkles className="h-6 w-6 text-primary" /> AI College Finder</CardTitle>
                <CardDescription>Tell us your preferences, and our AI will recommend the best-fit institutions for you.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-2 md:col-span-1">
                        <Label htmlFor="province">Province</Label>
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
                            <SelectItem value="NL">Newfoundland</SelectItem>
                            <SelectItem value="PE">Prince Edward Island</SelectItem>
                            <SelectItem value="NB">New Brunswick</SelectItem>
                            <SelectItem value="YT">Yukon</SelectItem>
                            <SelectItem value="NT">Northwest Territories</SelectItem>
                            <SelectItem value="NU">Nunavut</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2 md:col-span-1">
                        <Label htmlFor="fieldOfInterest">Field of Interest</Label>
                        <Input id="fieldOfInterest" value={fieldOfInterest} onChange={e => setFieldOfInterest(e.target.value)} placeholder="e.g., Computer Science" required />
                    </div>
                     <div className="space-y-2 md:col-span-1">
                        <Label>Max Tuition: <span className="font-semibold">{formatCurrency(maxTuition)}</span></Label>
                        <Slider defaultValue={[maxTuition]} max={100000} step={1000} onValueChange={(v) => setMaxTuition(v[0])} />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full md:w-auto">
                        {loading ? 'Finding...' : 'Find My College'}
                    </Button>
                </form>
            </CardContent>
        </Card>

        {loading && (
            <div className="space-y-8">
                <div>
                    <Skeleton className="h-8 w-1/4 mb-4" />
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <Skeleton className="h-80 w-full" />
                        <Skeleton className="h-80 w-full" />
                        <Skeleton className="h-80 w-full" />
                    </div>
                </div>
                 <div>
                    <Skeleton className="h-8 w-1/4 mb-4" />
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <Skeleton className="h-80 w-full" />
                    </div>
                </div>
            </div>
        )}

        {error && <p className="text-destructive text-center">{error}</p>}
        
        {results && (results.universities.length > 0 || results.colleges.length > 0) && (
            <div>
                 <div className="relative mb-8">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search recommended schools..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <CollegeResults title="Top University Matches" colleges={results.universities} studentProfile={applicationData} filteringLogic={filteringLogic} searchTerm={searchTerm} />
                <CollegeResults title="Top College Matches" colleges={results.colleges} studentProfile={applicationData} filteringLogic={filteringLogic} searchTerm={searchTerm} />
            </div>
        )}
      </div>
    );
}

export default function CollegeMatchPage() {
  return (
    <AppLayout>
        <CollegeMatchPageContent />
    </AppLayout>
  );
}
