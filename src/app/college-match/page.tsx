
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
import { WandSparkles, Search, Building, School as SchoolIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

const CollegeResults = ({ title, colleges, studentProfile, filteringLogic, searchTerm, icon: Icon }) => {
    const filteredColleges = useMemo(() => {
        if (!searchTerm) return colleges;
        return colleges.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [colleges, searchTerm]);

    if (!colleges || colleges.length === 0 || filteredColleges.length === 0) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 className="flex items-center gap-3 font-bold text-2xl mb-4"><Icon className="h-6 w-6 text-primary" />{title} ({filteredColleges.length})</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredColleges.map(college => (
                    <CollegeCard key={college.dliNumber} college={college} studentProfile={studentProfile} filteringLogic={filteringLogic} isMatch={true} />
                ))}
            </div>
        </motion.div>
    );
};

const LoadingSkeleton = () => (
    <div className="space-y-12">
        <div>
            <Skeleton className="h-8 w-1/3 mb-4" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-96 w-full rounded-xl" />
                <Skeleton className="h-96 w-full rounded-xl" />
                <Skeleton className="h-96 w-full rounded-xl" />
            </div>
        </div>
        <div>
            <Skeleton className="h-8 w-1/3 mb-4" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-96 w-full rounded-xl" />
            </div>
        </div>
    </div>
);

function CollegeMatchPageContent() {
    const { applicationData } = useApplication();
    const [province, setProvince] = useState('all');
    const [fieldOfInterest, setFieldOfInterest] = useState('');
    const [maxTuition, setMaxTuition] = useState(applicationData.finances?.totalFunds || 50000);
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
            setError("Sorry, the AI matchmaker is currently unavailable. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const filteringLogic = `Filtered for ${fieldOfInterest} in ${province !== 'all' ? province : 'any province'} with tuition under ${formatCurrency(maxTuition)}.`;

    return (
      <div className="flex-1 space-y-8 p-4 md:p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI College Finder</h1>
          <p className="text-muted-foreground mt-1">Tell us your preferences, and our AI will find the best-fit institutions for you.</p>
        </div>

        <Card>
            <CardHeader><CardTitle>Your Search Criteria</CardTitle></CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div className="space-y-2"><Label htmlFor="fieldOfInterest">Field of Interest</Label><Input id="fieldOfInterest" value={fieldOfInterest} onChange={e => setFieldOfInterest(e.target.value)} placeholder="e.g., Computer Science" required /></div>
                    <div className="space-y-2"><Label htmlFor="province">Province</Label><Select value={province} onValueChange={setProvince}><SelectTrigger id="province"><SelectValue placeholder="All Provinces" /></SelectTrigger><SelectContent>{/* Options */}</SelectContent></Select></div>
                    <div className="space-y-2"><Label>Max Annual Tuition: <span className="font-semibold">{formatCurrency(maxTuition)}</span></Label><Slider defaultValue={[maxTuition]} max={100000} step={1000} onValueChange={(v) => setMaxTuition(v[0])} /></div>
                    <Button type="submit" disabled={loading} className="w-full md:col-span-3">
                        <WandSparkles className="mr-2 h-4 w-4" />{loading ? 'Finding Best Fit...' : 'Find My College'}
                    </Button>
                </form>
            </CardContent>
        </Card>

        {loading && <LoadingSkeleton />}
        {error && <Card><CardContent className="p-8 text-center text-destructive">{error}</CardContent></Card>}
        
        <AnimatePresence>
            {results && (results.universities.length > 0 || results.colleges.length > 0) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="relative mb-8"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input placeholder="Filter recommended schools..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                    <div className="space-y-12">
                        <CollegeResults title="Top University Matches" colleges={results.universities} studentProfile={applicationData} filteringLogic={filteringLogic} searchTerm={searchTerm} icon={SchoolIcon} />
                        <CollegeResults title="Top College Matches" colleges={results.colleges} studentProfile={applicationData} filteringLogic={filteringLogic} searchTerm={searchTerm} icon={Building} />
                    </div>
                </motion.div>
            )}
            {results && results.universities.length === 0 && results.colleges.length === 0 && (
                 <Card><CardContent className="p-8 text-center text-muted-foreground">No matches found for your criteria. Try broadening your search.</CardContent></Card>
            )}
        </AnimatePresence>
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
