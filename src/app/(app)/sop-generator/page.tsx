
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { WandSparkles, FileText, Download, Copy, RefreshCw } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useApplication } from '@/context/application-context';
import { generateSopDraft, GenerateSopDraftInput } from '@/ai/flows/generate-sop-draft';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-48 w-full" />
    <div className="flex gap-2">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

export default function SopGeneratorPage() {
  const { applicationData, isLoaded } = useApplication();
  const [sopDraft, setSopDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSopDraft('');
    try {
      const { personalInfo, academics, studyPlan, finances } = applicationData;
      const input: GenerateSopDraftInput = {
        personalInfo: JSON.stringify(personalInfo),
        academics: JSON.stringify(academics),
        studyPlan: JSON.stringify(studyPlan),
        finances: JSON.stringify(finances),
        longTermGoals: studyPlan?.longTermGoals,
      };

      const response = await generateSopDraft(input);
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Could not read stream');
      }
      
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setSopDraft((prev) => prev + decoder.decode(value));
      }

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate the SOP draft. Please ensure your profile is complete.',
      });
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sopDraft);
    toast({ title: 'Copied to clipboard!' });
  };

  const handleDownload = () => {
    const blob = new Blob([sopDraft], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SOP_Draft.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (!isLoaded) {
    return (
       <main className="p-4 md:p-8">
        <Skeleton className="h-96 w-full" />
       </main>
    );
  }

  return (
      <main className="flex-1 space-y-8 p-4 md:p-8">
        <Card className="bg-surface1 border-white/10">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <WandSparkles className="h-6 w-6 text-blue" />
              AI Statement of Purpose (SOP) Generator
            </CardTitle>
            <CardDescription className="text-slateMuted">
              Generate a first draft of your Statement of Purpose based on the information you've provided in your application. Review and edit it carefully.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating && !sopDraft ? <LoadingSkeleton /> : (
                <Textarea
                    placeholder="Your generated SOP draft will appear here..."
                    className="min-h-[500px] font-serif text-lg bg-surface2 border-white/20"
                    value={sopDraft}
                    readOnly={isGenerating}
                    onChange={(e) => setSopDraft(e.target.value)}
                />
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Button onClick={handleGenerate} disabled={isGenerating} className="w-full sm:w-auto bg-blue hover:bg-blue/90">
              {isGenerating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <WandSparkles className="mr-2 h-4 w-4" />}
              {isGenerating ? 'Generating...' : sopDraft ? 'Regenerate Draft' : 'Generate Draft'}
            </Button>
            {sopDraft && !isGenerating && (
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" onClick={handleCopy} className="w-full"><Copy className="mr-2 h-4 w-4"/>Copy</Button>
                <Button variant="outline" onClick={handleDownload} className="w-full"><Download className="mr-2 h-4 w-4"/>Download</Button>
              </motion.div>
            )}
          </CardFooter>
        </Card>
      </main>
  );
}
