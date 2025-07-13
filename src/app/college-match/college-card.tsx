'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BrainCircuit, MapPin } from 'lucide-react';
import { ReasoningPanel } from './reasoning-panel';

type College = {
  id: number;
  name: string;
  province: string;
  city: string;
  programs: string[];
  image: string;
  aiHint: string;
};

export function CollegeCard({ college }: { college: College }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <div className="relative h-48 w-full">
        <Image src={college.image} alt={college.name} layout="fill" objectFit="cover" data-ai-hint={college.aiHint} />
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-lg">{college.name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {college.city}, {college.province}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between">
        <div className="mb-4 flex flex-wrap gap-2">
          {college.programs.map((program) => (
            <Badge key={program} variant="secondary">
              {program}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch id={`favorite-${college.id}`} />
            <Label htmlFor={`favorite-${college.id}`}>Save Favorite</Label>
          </div>
        </div>
      </CardContent>
      <Accordion type="single" collapsible className="w-full bg-primary/5">
        <AccordionItem value="item-1" className="border-t">
          <AccordionTrigger className="px-6 py-3 text-sm font-semibold text-primary hover:no-underline">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" />
              <span>AI Reasoning</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <ReasoningPanel dliDetails={{ name: college.name, province: college.province }} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
