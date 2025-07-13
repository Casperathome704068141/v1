'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type College = {
  id: number;
  name: string;
  province: string;
  city: string;
  programs: string[];
  image: string;
  aiHint: string;
  tuition: number;
};

export function CollegeCard({ college }: { college: College }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <div className="relative h-48 w-full bg-muted">
        <Image src={college.image} alt={college.name} layout="fill" objectFit="cover" data-ai-hint={college.aiHint} />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-base font-bold">{college.name}</CardTitle>
        <CardDescription className="text-xs">
          {college.province}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between p-4 pt-0">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {college.programs.slice(0, 1).map((program) => (
            <Badge key={program} variant="secondary" className="font-normal">
              {program}
            </Badge>
          ))}
           <Badge variant="secondary" className="font-normal">
            ${college.tuition.toLocaleString()}/year
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id={`favorite-${college.id}`} />
          <Label htmlFor={`favorite-${college.id}`} className="text-xs font-normal">Save to favorites</Label>
        </div>
      </CardContent>
    </Card>
  );
}
