
'use client';

import { AppLayout } from '@/components/app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LifeBuoy, Mail, Phone } from 'lucide-react';
import { SiteHeader } from '@/components/marketing/site-header';
import Link from 'next/link';
import Image from 'next/image';

const faqItems = [
    {
        question: "How does the College Match AI work?",
        answer: "Our AI considers your academic profile, financial situation, and study preferences to suggest Designated Learning Institutions (DLIs) that are a good fit. It also explains why some schools might not be shown, helping you understand your options better."
    },
    {
        question: "Is the information I enter into the application saved?",
        answer: "Yes, your progress is saved automatically to our secure database as you move between steps. You can log out and resume your application at any time from any device."
    },
    {
        question: "What is a Statement of Purpose (SOP)?",
        answer: "An SOP, or Letter of Explanation, is a critical document where you explain to the visa officer why you want to study in Canada, why you chose your specific program, and how it aligns with your future goals. Our AI Assistant can help you generate a first draft based on your profile information."
    },
    {
        question: "Can I book a consultation with an immigration expert?",
        answer: "Yes! Our Advantage and Elite plans include consultations with a Regulated Canadian Immigration Consultant (RCIC). You can book a session through the 'Appointments' page in your dashboard or by upgrading your plan on the 'Pricing' page."
    },
    {
        question: "What happens after I submit my application through your platform?",
        answer: "Once submitted, your application is checked for completeness. If you are on a plan that includes an RCIC review, one of our consultants will perform a final quality assurance check and provide feedback. After that, you'll be guided on how to submit the application to the official IRCC portal."
    }
]

export default function SupportPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto max-w-5xl py-12 md:py-20 px-4 md:px-6">
            <div className="text-center mb-12">
                <h1 className="font-headline text-4xl font-black text-foreground">Help & Support</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    We're here to help. Find answers to common questions or get in touch with our team.
                </p>
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
                                    <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                                    <AccordionContent>
                                        {item.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-8">
                     <Card>
                      <CardHeader>
                        <CardTitle>Contact Us</CardTitle>
                        <CardDescription>
                          Can't find an answer? Reach out to us directly.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start gap-4">
                            <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-semibold">Email</p>
                                <a href="mailto:support@mapleleafseducation.ca" className="text-sm text-muted-foreground hover:underline">support@mapleleafseducation.ca</a>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-semibold">Phone</p>
                                <a href="tel:+1-800-555-1234" className="text-sm text-muted-foreground hover:underline">+1 (800) 555-1234</a>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <LifeBuoy className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-semibold">Support Hours</p>
                                <p className="text-sm text-muted-foreground">Mon-Fri, 9am-5pm EST</p>
                            </div>
                        </div>
                      </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      </main>
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Image src="/logo.svg" alt="Maple Leafs Education Logo" width={24} height={24} />
                <span className="font-bold text-lg">Maple Leafs Education</span>
              </div>
              <p className="text-xs text-muted-foreground">&copy; 2024 Maple Leafs Education. <br /> A BENO 1017 Product.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Platform</h4>
              <nav className="flex flex-col gap-1 text-sm text-muted-foreground">
                <Link href="/#how-it-works" className="hover:text-primary hover:underline">How It Works</Link>
                <Link href="/#testimonials" className="hover:text-primary hover:underline">Testimonials</Link>
              </nav>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Company</h4>
               <nav className="flex flex-col gap-1 text-sm text-muted-foreground">
                <Link href="/about" className="hover:text-primary hover:underline">About Us</Link>
                <Link href="/support" className="hover:text-primary hover:underline">Contact</Link>
                <Link href="/privacy" className="hover:text-primary hover:underline">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-primary hover:underline">Terms of Service</Link>
              </nav>
            </div>
             <div>
              <h4 className="font-semibold mb-2">Get Started</h4>
              <nav className="flex flex-col gap-1 text-sm text-muted-foreground">
                <Link href="/login" className="hover:text-primary hover:underline">Log In</Link>
                <Link href="/signup" className="hover:text-primary hover:underline">Sign Up</Link>
                <Link href="/support" className="hover:text-primary hover:underline">Support</Link>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
