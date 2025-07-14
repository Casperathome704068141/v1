
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { subDays, format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

type SignupData = {
    date: string;
    count: number;
};

export function SignupsChart() {
    const [data, setData] = useState<SignupData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSignups() {
            setLoading(true);
            try {
                const sevenDaysAgo = subDays(new Date(), 7);
                const sevenDaysAgoTimestamp = Timestamp.fromDate(sevenDaysAgo);

                const usersCollection = collection(db, 'users');
                const q = query(usersCollection, where('signedUp', '>=', sevenDaysAgoTimestamp));
                const querySnapshot = await getDocs(q);

                const countsByDay: { [key: string]: number } = {};
                
                // Initialize last 7 days with 0 counts
                for (let i = 0; i < 7; i++) {
                    const day = format(subDays(new Date(), i), 'MMM d');
                    countsByDay[day] = 0;
                }

                querySnapshot.forEach((doc) => {
                    const signupDate = doc.data().signedUp?.toDate();
                    if (signupDate) {
                        const day = format(signupDate, 'MMM d');
                         if (countsByDay.hasOwnProperty(day)) {
                            countsByDay[day]++;
                        }
                    }
                });

                const chartData = Object.entries(countsByDay)
                    .map(([date, count]) => ({ date, count }))
                    .reverse(); // To show chronologically

                setData(chartData);
            } catch (error) {
                console.error("Error fetching signup data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchSignups();
    }, []);

    if (loading) {
        return <Skeleton className="h-[350px] w-full" />;
    }

    return (
        <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis
                        dataKey="date"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                    />
                    <Tooltip 
                        contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)",
                        }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
