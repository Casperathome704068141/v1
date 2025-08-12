
'use client';

import { motion } from 'framer-motion';
import { LifeBuoy, Mail, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const contactOptions = [
    { icon: Mail, title: 'Email Support', description: 'Get detailed assistance via email.', cta: 'support@mapleleafs.com', href: 'mailto:support@mapleleafs.com' },
    { icon: Phone, title: 'Phone Support', description: 'Speak directly with our support team.', cta: '+1 (800) 555-1234', href: 'tel:+1-800-555-1234' },
    { icon: MessageSquare, title: 'Live Chat', description: 'Chat with a representative in real-time for quick answers.', cta: 'Start Chat', href: '#' },
];

export default function SupportPage() {
  return (
    <div className="container mx-auto max-w-6xl py-24 md:py-32">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
        >
            <div className="inline-block p-4 bg-blue/10 rounded-full mb-4">
                <LifeBuoy className="h-12 w-12 text-blue" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-balance">
                We're Here to Help
            </h1>
            <p className="mt-4 text-lg text-slateMuted max-w-3xl mx-auto text-balance">
                Have a question or need assistance? Our team is ready to support you. Choose your preferred way to get in touch.
            </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
                {contactOptions.map((option, index) => (
                    <motion.div
                        key={option.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <Link href={option.href} className="flex items-start gap-6 group">
                           <div className="mt-1 flex-shrink-0">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface1 border border-white/10 text-blue group-hover:bg-blue group-hover:text-white transition-colors">
                                    <option.icon className="h-6 w-6" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{option.title}</h3>
                                <p className="mt-1 text-slateMuted">{option.description}</p>
                                <p className="mt-2 text-sm text-blue font-semibold group-hover:underline">{option.cta}</p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card className="bg-surface1 border-white/10">
                    <CardHeader>
                        <CardTitle className="font-display text-2xl">Send us a Message</CardTitle>
                        <CardDescription>Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input placeholder="Your Name" className="bg-surface2 h-12 border-white/10" />
                                <Input type="email" placeholder="Your Email" className="bg-surface2 h-12 border-white/10" />
                            </div>
                            <Input placeholder="Subject" className="bg-surface2 h-12 border-white/10" />
                            <Textarea placeholder="Your message..." className="bg-surface2 border-white/10 min-h-[120px]" />
                            <Button type="submit" size="lg" className="w-full bg-blue text-white hover:bg-blue/90">Send Message</Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    </div>
  );
}
