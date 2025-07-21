
'use client';

import { AppLayout } from '@/components/app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LifeBuoy, Mail, Phone } from 'lucide-react';
import { SiteHeader } from '@/components/marketing/site-header';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

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
        question: "How do I request an appointment with an expert?",
        answer: "If your plan includes consultations, you can navigate to the 'Appointments' page from your dashboard. There, you can fill out a form to request a meeting time. Our team will review your request and confirm a time with you."
    },
    {
        question: "What happens after I submit my application through your platform?",
        answer: "Once submitted, your application is checked for completeness. If you are on a plan that includes an RCIC review, one of our consultants will perform a final quality assurance check and provide feedback. After that, you'll be guided on how to submit the application to the official IRCC portal."
    }
]

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.46 3.48 1.34 4.94l-1.48 5.45 5.58-1.45c1.41.83 3.01 1.26 4.7 1.26 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM12.04 20.3c-1.52 0-2.97-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.32c-.82-1.28-1.25-2.78-1.25-4.32 0-4.54 3.69-8.23 8.23-8.23 4.54 0 8.23 3.69 8.23 8.23s-3.69 8.23-8.23 8.23zm4.2-6.17c-.23-.12-1.36-.67-1.57-.75-.21-.08-.36-.12-.51.12-.15.23-.59.75-.73.9-.13.15-.27.17-.5.05-.23-.12-1-.36-1.89-1.16-.7-.63-1.17-1.41-1.31-1.65-.13-.23-.01-.36.11-.48.11-.11.23-.27.35-.42.12-.15.16-.27.23-.46.08-.18.04-.34-.02-.46-.06-.12-.51-1.23-.7-1.68-.19-.45-.38-.39-.51-.39h-.4c-.15 0-.39.04-.59.23-.2.18-.78.76-.78 1.85s.8 2.15.92 2.31c.11.15 1.56 2.56 3.8 3.55 2.24.99 2.24.66 2.64.62.4-.04 1.36-.56 1.55-1.1.19-.55.19-1.02.13-1.12s-.2-.18-.42-.3z"></path>
  </svg>
);

const ZoomIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M11.984 15.633l-4.22 2.411c-.569.324-1.268.324-1.837 0-.569-.325-.919-.92-.919-1.575V7.53c0-.655.35-1.25.918-1.575.57-.324 1.269-.324 1.838 0l4.22 2.411c.568.325.918.92.918 1.575 0 .655-.35 1.25-.918 1.575zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm10.337 13.914h-5.06v-3.828h5.06c.453 0 .821.368.821.821v2.186c0 .453-.368.821-.821.821z"></path>
  </svg>
);
const TeamsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.429 1.009C11.536.525 10.37.762 9.886 1.654L6.11 7.828a.5.5 0 0 0 .433.748h2.957a.5.5 0 0 1 .433.748l-3.776 6.174c-.484.892.053 2.058.946 2.542l.523.278c.893.484 2.059.247 2.543-.645l3.776-6.174a.5.5 0 0 0-.433-.748H10.61a.5.5 0 0 1-.433-.748l3.776-6.174c.484-.892-.053-2.058-.946-2.542l-.523-.278zM17.485 5.58a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM14 20.418c-3.14-.11-5.71-2.91-5.49-6.07.22-3.16 3.12-5.49 6.28-5.38 3.16.11 5.71 2.91 5.49 6.07a5.53 5.53 0 0 1-6.28 5.38z"></path>
  </svg>
);

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

                    <Card>
                        <CardHeader>
                            <CardTitle>Live Support</CardTitle>
                            <CardDescription>Chat with our team directly.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <Button size="lg" className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white" asChild>
                                <a href="https://wa.me/14376063897" target="_blank" rel="noopener noreferrer">
                                    <WhatsAppIcon className="mr-2 h-6 w-6" /> WhatsApp
                                </a>
                            </Button>
                             <Button size="lg" className="w-full bg-[#2D8CFF] hover:bg-[#0b71f2] text-white" asChild>
                                <a href="/#" target="_blank" rel="noopener noreferrer">
                                    <ZoomIcon className="mr-2 h-6 w-6" /> Zoom
                                </a>
                            </Button>
                             <Button size="lg" className="w-full bg-[#6264A7] hover:bg-[#464775] text-white" asChild>
                                <a href="/#" target="_blank" rel="noopener noreferrer">
                                    <TeamsIcon className="mr-2 h-6 w-6" /> Microsoft Teams
                                </a>
                            </Button>
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
