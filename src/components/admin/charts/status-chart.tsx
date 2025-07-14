
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

type StatusData = {
    name: string;
    value: number;
};

const COLORS = {
  'Pending Review': 'hsl(48, 96%, 50%)', // Yellow
  'Approved': 'hsl(142, 71%, 45%)',     // Green
  'Action Required': 'hsl(0, 84%, 60%)', // Red
  'Rejected': 'hsl(0, 0%, 50%)',        // Gray
};

export function StatusChart() {
    const [data, setData] = useState<StatusData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStatuses() {
            setLoading(true);
            try {
                const applicationsCollection = collection(db, 'applications');
                const querySnapshot = await getDocs(applicationsCollection);

                const statusCounts: { [key: string]: number } = {
                    'Pending Review': 0,
                    'Approved': 0,
                    'Action Required': 0,
                    'Rejected': 0,
                };

                querySnapshot.forEach((doc) => {
                    const status = doc.data().status;
                    if (statusCounts.hasOwnProperty(status)) {
                        statusCounts[status]++;
                    }
                });

                const chartData = Object.entries(statusCounts)
                    .map(([name, value]) => ({ name, value }))
                    .filter(item => item.value > 0);

                setData(chartData);
            } catch (error) {
                console.error("Error fetching application statuses:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStatuses();
    }, []);

    if (loading) {
        return <Skeleton className="h-[350px] w-full rounded-full" />;
    }

    if (data.length === 0) {
        return <div className="h-[350px] flex items-center justify-center text-muted-foreground">No application data to display.</div>;
    }

    return (
        <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Tooltip 
                        contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)",
                        }}
                    />
                    <Legend />
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
