
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
import { Switch } from '@/components/ui/switch';
import { collegeData, College } from '@/lib/college-data';

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
    const allColleges: College[] = collegeData;
    
    // State for filters
    const [province, setProvince] = useState('all');
    const [programType, setProgramType] = useState('all');
    const [showUnmatched, setShowUnmatched] = useState(false);
    
    // User's budget from their profile, with a default fallback
    const studentBudget = applicationData.finances?.totalFunds;
    const [maxTuition, setMaxTuition] = useState(studentBudget || 70000);

    const { matchedColleges, unmatchedColleges } = useMemo(() => {
        const matched: (College & { isMatch: boolean; reason: string })[] = [];
        const unmatched: (College & { isMatch: boolean; reason: string })[] = [];

        allColleges.forEach(college => {
            const isProvinceMatch = province === 'all' || college.province === province;
            const isTuitionMatch = college.tuitionHigh <= maxTuition;
            const isMatch = isProvinceMatch && isTuitionMatch;
            
            let reason = '';
            if (!isTuitionMatch) {
                reason = `The estimated high-end tuition of ${formatCurrency(college.tuitionHigh)} exceeds your current budget of ${formatCurrency(maxTuition)}.`;
            } else if (!isProvinceMatch) {
                reason = 'Not in your selected province.';
            }
            
            const collegeWithStatus = { ...college, isMatch, reason };

            if (isMatch) {
                matched.push(collegeWithStatus);
            } else if (province === 'all' || isProvinceMatch) {
                unmatched.push(collegeWithStatus);
            }
        });

        return { matchedColleges: matched, unmatchedColleges: unmatched };
    }, [province, maxTuition, allColleges]);

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
                      <SelectItem value="PE">Prince Edward Island</SelectItem>
                      <SelectItem value="NB">New Brunswick</SelectItem>
                      <SelectItem value="YT">Yukon</SelectItem>
                      <SelectItem value="NT">Northwest Territories</SelectItem>
                      <SelectItem value="NU">Nunavut</SelectItem>
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
                <h1 className="font-bold text-xl">Recommended DLIs ({matchedColleges.length})</h1>
                <p className="text-sm text-muted-foreground">
                    Based on your profile and selected filters.
                </p>
            </div>

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
                            These may not be a match based on your current budget or filters.
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
        </main>
      </div>
  );
}


export default function CollegeMatchPage() {
  return (
    <AppLayout>
