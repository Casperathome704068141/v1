
'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CollegeCard } from './college-card';
import { useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { useApplication } from '@/context/application-context';
import { Switch } from '@/components/ui/switch';


const mockColleges = [
    { dliNumber: 'O19332746152', name: 'University of Toronto', province: 'ON', city: 'Toronto', pgwpEligible: true, sdsEligible: true, tuitionLow: 57000, tuitionHigh: 69000, image: 'https://placehold.co/600x400.png', aiHint: 'university campus', programs: ['Computer Science', 'Engineering Science', 'Rotman Commerce', 'Life Sciences'] },
    { dliNumber: 'O18713254822', name: 'University of Waterloo', province: 'ON', city: 'Waterloo', pgwpEligible: true, sdsEligible: true, tuitionLow: 45000, tuitionHigh: 66000, image: 'https://placehold.co/600x400.png', aiHint: 'modern university', programs: ['Co-op Computer Engineering', 'Data Science', 'Environment, Resources & Sustainability'] },
    { dliNumber: 'O19332746142', name: 'York University', province: 'ON', city: 'Toronto', pgwpEligible: true, sdsEligible: true, tuitionLow: 33000, tuitionHigh: 40000, image: 'https://placehold.co/600x400.png', aiHint: 'university building', programs: ['Actuarial Science', 'Psychology', 'Engineering', 'Digital Media'] },
    { dliNumber: 'O19359011021', name: 'Dalhousie University', province: 'NS', city: 'Halifax', pgwpEligible: true, sdsEligible: true, tuitionLow: 25000, tuitionHigh: 40000, image: 'https://placehold.co/600x400.png', aiHint: 'campus green', programs: ['Biochemistry', 'Computer Science', 'Commerce', 'Nursing'] },
    { dliNumber: 'O19375391192', name: 'University of British Columbia', province: 'BC', city: 'Vancouver', pgwpEligible: true, sdsEligible: true, tuitionLow: 49000, tuitionHigh: 64000, image: 'https://placehold.co/600x400.png', aiHint: 'modern architecture', programs: ['Applied Science (Engineering)', 'Sauder Commerce', 'Arts', 'Forestry'] },
    { dliNumber: 'O19391528447', name: 'McGill University', province: 'QC', city: 'Montreal', pgwpEligible: true, sdsEligible: true, tuitionLow: 29000, tuitionHigh: 53000, image: 'https://placehold.co/600x400.png', aiHint: 'historic building', programs: ['Mechanical Engineering', 'Desautels BCom (Business)', 'Biological Sciences'] },
    { dliNumber: 'O19425660302', name: 'University of Alberta', province: 'AB', city: 'Edmonton', pgwpEligible: true, sdsEligible: true, tuitionLow: 31000, tuitionHigh: 45000, image: 'https://placehold.co/600x400.png', aiHint: 'university building', programs: ['Computing Science', 'Petroleum Engineering', 'Business', 'Pharmacy & Pharm Sci'] },
    { dliNumber: 'O19332777742', name: 'University of Manitoba', province: 'MB', city: 'Winnipeg', pgwpEligible: true, sdsEligible: true, tuitionLow: 18000, tuitionHigh: 28000, image: 'https://placehold.co/600x400.png', aiHint: 'university library', programs: ['Agribusiness', 'Architecture', 'Kinesiology', 'Arts & Science'] },
    { dliNumber: 'O19389056802', name: 'University of Calgary', province: 'AB', city: 'Calgary', pgwpEligible: true, sdsEligible: true, tuitionLow: 28000, tuitionHigh: 42000, image: 'https://placehold.co/600x400.png', aiHint: 'campus landscape', programs: ['Accounting', 'Actuarial Science', 'Software Engineering', 'Nursing'] },
    { dliNumber: 'O19332746162', name: 'Memorial Univ. of Newfoundland', province: 'NL', city: 'St. John\'s', pgwpEligible: true, sdsEligible: true, tuitionLow: 20000, tuitionHigh: 25000, image: 'https://placehold.co/600x400.png', aiHint: 'coastal university', programs: ['Commerce', 'Ocean & Naval Architecture Eng.', 'Education', 'Computer Sci'] },
    { dliNumber: 'O19395299688', name: 'Saskatchewan Polytechnic', province: 'SK', city: 'Saskatoon', pgwpEligible: true, sdsEligible: true, tuitionLow: 15000, tuitionHigh: 21000, image: 'https://placehold.co/600x400.png', aiHint: 'polytechnic institute', programs: ['Advanced Care Paramedic', 'Cybersecurity Diploma', 'Business Cert.'] },
    { dliNumber: 'O19362846522', name: 'Thompson Rivers University', province: 'BC', city: 'Kamloops', pgwpEligible: true, sdsEligible: true, tuitionLow: 19000, tuitionHigh: 24000, image: 'https://placehold.co/600x400.png', aiHint: 'mountain campus', programs: ['Adventure Tourism', 'BBA', 'Computing Science', 'Master of Education'] },
    { dliNumber: 'O19332724752', name: 'Vancouver Island University', province: 'BC', city: 'Nanaimo', pgwpEligible: true, sdsEligible: true, tuitionLow: 20000, tuitionHigh: 25000, image: 'https://placehold.co/600x400.png', aiHint: 'island campus', programs: ['Hospitality Mgmt', 'Fisheries & Aquaculture', 'MBA', 'Computer Science Minor'] },
    { dliNumber: 'O19332543352', name: 'Algonquin College', province: 'ON', city: 'Ottawa', pgwpEligible: true, sdsEligible: true, tuitionLow: 16000, tuitionHigh: 19000, image: 'https://placehold.co/600x400.png', aiHint: 'college campus', programs: ['Mobile App Dev (Grad Cert)', 'Cloud Computing', 'Mechanical Eng. Tech'] },
    { dliNumber: 'O214383061827', name: 'Humber College', province: 'ON', city: 'Toronto', pgwpEligible: true, sdsEligible: true, tuitionLow: 17000, tuitionHigh: 22000, image: 'https://placehold.co/600x400.png', aiHint: 'modern college', programs: ['Global Business Mgmt (PG Cert)', 'UX Design', 'Graphic Design Dip'] },
    { dliNumber: 'O19305391192', name: 'George Brown College', province: 'ON', city: 'Toronto', pgwpEligible: true, sdsEligible: true, tuitionLow: 15000, tuitionHigh: 23000, image: 'https://placehold.co/600x400.png', aiHint: 'city college', programs: ['Culinary Mgmt', 'Construction Tech Mgmt', 'Interactive Media Design'] },
    { dliNumber: 'O19359010512', name: 'Seneca Polytechnic', province: 'ON', city: 'Toronto', pgwpEligible: true, sdsEligible: true, tuitionLow: 16000, tuitionHigh: 22000, image: 'https://placehold.co/600x400.png', aiHint: 'seneca campus', programs: ['Data Analytics Grad Cert', 'Aviation Operations', 'Animation (2D/3D)'] },
    { dliNumber: 'O19359011031', name: 'Centennial College', province: 'ON', city: 'Toronto', pgwpEligible: true, sdsEligible: true, tuitionLow: 17000, tuitionHigh: 21000, image: 'https://placehold.co/600x400.png', aiHint: 'centennial college building', programs: ['Aerospace Manuf.', 'Game Design & Dev', 'Early Childhood Ed'] },
    { dliNumber: 'O19359011041', name: 'Sheridan College', province: 'ON', city: 'Oakville', pgwpEligible: true, sdsEligible: true, tuitionLow: 18000, tuitionHigh: 25000, image: 'https://placehold.co/600x400.png', aiHint: 'animation studio', programs: ['Computer Animation', 'Bachelor of Film & Television', 'UX Design'] },
    { dliNumber: 'O19332746172', name: 'Fanshawe College', province: 'ON', city: 'London', pgwpEligible: true, sdsEligible: true, tuitionLow: 16000, tuitionHigh: 20000, image: 'https://placehold.co/600x400.png', aiHint: 'fanshawe building', programs: ['Biotechnology Dip', 'Project Mgmt (PG Cert)', 'Network & Security Analyst'] },
    { dliNumber: 'O19395399642', name: 'Red River College Polytech', province: 'MB', city: 'Winnipeg', pgwpEligible: true, sdsEligible: true, tuitionLow: 15000, tuitionHigh: 19000, image: 'https://placehold.co/600x400.png', aiHint: 'red river campus', programs: ['Business Admin', 'Nursing', 'Applied Computer Science'] },
    { dliNumber: 'O19359011571', name: 'Carleton University', province: 'ON', city: 'Ottawa', pgwpEligible: true, sdsEligible: true, tuitionLow: 31000, tuitionHigh: 45000, image: 'https://placehold.co/600x400.png', aiHint: 'carleton university campus', programs: ['Aerospace Engineering', 'Global & Intl Studies', 'Journalism'] },
    { dliNumber: 'O19359011051', name: 'University of Ottawa', province: 'ON', city: 'Ottawa', pgwpEligible: true, sdsEligible: true, tuitionLow: 38000, tuitionHigh: 55000, image: 'https://placehold.co/600x400.png', aiHint: 'ottawa university building', programs: ['Civil Engineering (Co-op)', 'Data Science BSc', 'International Development'] },
    { dliNumber: 'O19359011441', name: 'Concordia University', province: 'QC', city: 'Montreal', pgwpEligible: true, sdsEligible: true, tuitionLow: 25000, tuitionHigh: 35000, image: 'https://placehold.co/600x400.png', aiHint: 'concordia university campus', programs: ['Actuarial Math', 'BFA Acting', 'Building Eng.', 'Software Engineering'] },
    { dliNumber: 'O19359011491', name: 'Université Laval', province: 'QC', city: 'Quebec City', pgwpEligible: true, sdsEligible: true, tuitionLow: 22000, tuitionHigh: 28000, image: 'https://placehold.co/600x400.png', aiHint: 'laval university architecture', programs: ['Agronomy', 'International Studies', 'Business Analytics'] },
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
    const [showUnmatched, setShowUnmatched] = useState(false);
    
    // User's budget from their profile, with a default fallback
    const studentBudget = applicationData.finances?.totalFunds;
    const [maxTuition, setMaxTuition] = useState(studentBudget || 70000);
    
    const matchedColleges = useMemo(() => {
        return mockColleges
            .map(college => {
                const isProvinceMatch = province === 'all' || college.province === province;
                const isTuitionMatch = college.tuitionHigh <= maxTuition;
                const isMatch = isProvinceMatch && isTuitionMatch;
                let reason = '';
                if (!isTuitionMatch) reason = 'Tuition exceeds your budget.';
                else if (!isProvinceMatch) reason = 'Not in your selected province.';
                
                return { ...college, isMatch, reason };
            })
            .filter(college => college.isMatch);
    }, [province, maxTuition]);

    const unmatchedColleges = useMemo(() => {
         return mockColleges
            .map(college => {
                const isProvinceMatch = province === 'all' || college.province === province;
                const isTuitionMatch = college.tuitionHigh <= maxTuition;
                const isMatch = isProvinceMatch && isTuitionMatch;
                let reason = '';
                if (!isTuitionMatch) reason = `The estimated high-end tuition of ${formatCurrency(college.tuitionHigh)} exceeds your current budget of ${formatCurrency(maxTuition)}.`;
                
                return { ...college, isMatch, reason };
            })
            .filter(college => !college.isMatch && (province === 'all' || college.province === province));
    }, [province, maxTuition]);


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
              <form className="space-y-6">
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
                      <SelectItem value="NL">Newfoundland</SelectItem>
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
                  <Label className="text-xs">Your Max Tuition: <span className="font-semibold">{formatCurrency(maxTuition)}</span></Label>
                  <Slider
                    defaultValue={[maxTuition]}
                    max={100000}
                    step={1000}
                    onValueChange={(value) => setMaxTuition(value[0])}
                  />
                </div>
                 <div className="flex items-center space-x-2 pt-4">
                    <Switch id="show-unmatched" checked={showUnmatched} onCheckedChange={setShowUnmatched} />
                    <Label htmlFor="show-unmatched">Show colleges beyond my budget</Label>
                </div>
              </form>
            </CardContent>
          </Card>
        </aside>

        <main className="md:col-span-3">
            <div className="mb-4">
                <h1 className="font-bold text-xl">Recommended DLIs ({loading ? '...' : matchedColleges.length})</h1>
                <p className="text-sm text-muted-foreground">
                    Based on your profile and selected filters.
                </p>
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
                <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {matchedColleges.map((college) => (
                        <CollegeCard 
                            key={college.dliNumber} 
                            college={college} 
                            studentProfile={applicationData}
                            filteringLogic={filteringLogic}
                            isMatch={true}
                        />
                    ))}
                </div>
                {showUnmatched && unmatchedColleges.length > 0 && (
                    <>
                        <div className="my-8">
                            <h2 className="font-bold text-xl">Other DLIs ({unmatchedColleges.length})</h2>
                            <p className="text-sm text-muted-foreground">
                                These may not be a match based on your current budget.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                             {unmatchedColleges.map((college) => (
                                <CollegeCard 
                                    key={college.dliNumber} 
                                    college={college} 
                                    studentProfile={applicationData}
                                    filteringLogic={filteringLogic}
                                    isMatch={false}
                                    reason={college.reason}
                                />
                            ))}
                        </div>
                    </>
                )}
                </>
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
