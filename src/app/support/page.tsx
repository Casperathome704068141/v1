
'use client';

import { AppLayout } from '@/components/app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LifeBuoy, Mail, Phone } from 'lucide-react';

const faqItems = [
    {
        question: "How does the College Match AI work?",
        answer: "Our AI considers your academic profile, financial situation, and study preferences to suggest Designated Learning Institutions (DLIs) that are a good fit. It also explains why some schools might not be shown, helping you understand your options better."
    },
    {
        question: "Is the information I enter into the application saved?",
        answer: "Yes, your progress is saved automatically in your browser as you move between steps. You can log out and resume your application at any time."
    },
    {
        question: "What is a Statement of Purpose (SOP)?",
        answer: "An SOP, or Letter of Explanation, is a critical document where you explain to the visa officer why you want to study in Canada, why you chose your specific program, and how it aligns with your future goals. Our AI Assistant can help you generate a first draft."
    },
    {
        question: "Can I book a consultation with an immigration expert?",
        answer: "Yes! Our Premium and Ultimate plans include consultations with a Regulated Canadian Immigration Consultant (RCIC). You can book a session through the 'Appointments' page."
    }
]

export default function SupportPage() {
  return (
    <AppLayout>
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">Help & Support</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>
                      Find answers to common questions about our platform and the application process.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Accordion type="single" collapsible className="w-full">
                        {faqItems.map((item, index) => (
                             <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger>{item.question}</AccordionTrigger>
                                <AccordionContent>
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                  </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                 <Card>
                  <CardHeader>
                    <CardTitle>Contact Us</CardTitle>
                    <CardDescription>
                      Can't find an answer? Reach out to us directly.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Mail className="h-5 w-5 text-primary" />
                        <a href="mailto:support@mapleleafs.edu" className="text-sm hover:underline">support@mapleleafs.edu</a>
                    </div>
                     <div className="flex items-center gap-4">
                        <Phone className="h-5 w-5 text-primary" />
                        <a href="tel:+1-800-555-1234" className="text-sm hover:underline">+1 (800) 555-1234</a>
                    </div>
                     <div className="flex items-center gap-4">
                        <LifeBuoy className="h-5 w-5 text-primary" />
                        <span className="text-sm">Mon-Fri, 9am-5pm EST</span>
                    </div>
                  </CardContent>
                </Card>
            </div>
        </div>

      </main>
    </AppLayout>
  );
}
