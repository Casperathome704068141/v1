
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LifeBuoy, Mail, Phone, MessageSquare, Headset, Zap } from 'lucide-react';
import { SiteHeader } from '@/components/marketing/site-header';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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
];

const contactOptions = [
    { icon: Mail, title: 'Email Support', description: 'Get detailed assistance via email.', href: 'mailto:support@mapleleafseducation.ca', cta: 'Send Email' },
    { icon: Phone, title: 'Phone Support', description: 'Speak directly with our support team.', href: 'tel:+1-800-555-1234', cta: 'Call Now' },
    { icon: MessageSquare, title: 'Live Chat', description: 'Chat with a representative in real-time.', href: '/#live-chat', cta: 'Start Chat' },
];

export default function SupportPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto max-w-5xl py-12 md:py-20 px-4 md:px-6">
            <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                    <Headset className="h-16 w-16 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Help & Support</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    We're here to help you every step of the way. Find answers to common questions or reach out to our dedicated support team.
                </p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="border-border/50">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold">Frequently Asked Questions</CardTitle>
                        <CardDescription>Find quick answers to the most common questions about our services and the application process.</CardDescription>
                      </CardHeader>
                      <CardContent>
                         <Accordion type="single" collapsible className="w-full">
                            {faqItems.map((item, index) => (
                                 <AccordionItem key={index} value={`item-${index}`} className="border-b-border/50">
                                    <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline data-[state=open]:text-primary data-[state=open]:font-bold">
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed pt-2 text-base">
                                        {item.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-8">
                     <Card className="border-border/50">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold">Get In Touch</CardTitle>
                        <CardDescription>Couldn't find what you were looking for? Contact us directly.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {contactOptions.map((option, index) => {
                            const Icon = option.icon;
                            return (
                                <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                                    <Icon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-bold text-lg">{option.title}</p>
                                        <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={option.href}>{option.cta}</Link>
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-primary"><Zap className="h-6 w-6" />Premium Support</CardTitle>
                            <CardDescription className="text-primary/80 dark:text-primary/90">Priority channels for Advantage and Elite plan holders.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <Button size="lg" className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white transition-colors duration-200 shadow-md hover:shadow-lg" asChild>
                                <a href="https://wa.me/14376063897" target="_blank" rel="noopener noreferrer">
                                    WhatsApp (Elite)
                                </a>
                            </Button>
                            <Button size="lg" className="w-full" variant="outline" asChild>
                                <Link href="/appointments">
                                    Book 1-on-1 (Advantage+)
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      </main>
      <footer className="bg-card border-t">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-5">
            <div className="md:col-span-2">
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
