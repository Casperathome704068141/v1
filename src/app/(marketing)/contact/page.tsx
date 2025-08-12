
'use client'
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Building, Globe, Mail } from 'lucide-react';


export default function ContactPage() {
    return (
        <div className="container mx-auto py-24 md:py-32">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
            >
                <h1 className="font-display text-4xl md:text-5xl text-balance">
                    Get in Touch
                </h1>
                <p className="mt-4 text-lg text-slateMuted max-w-3xl mx-auto text-balance">
                    Whether you have a question about our features, pricing, or anything else, our team is ready to answer all your questions.
                </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-surface1 p-8 md:p-12 rounded-lg border border-white/10">
                <div className="space-y-8">
                    <div className="flex gap-4">
                        <Mail className="h-6 w-6 text-blue mt-1" />
                        <div>
                            <h3 className="text-xl font-bold">Email</h3>
                            <p className="text-slateMuted">Our support team will get back to you within 24 hours.</p>
                            <a href="mailto:contact@mapleleafs.com" className="text-blue font-semibold hover:underline">contact@mapleleafs.com</a>
                        </div>
                    </div>
                     <div className="flex gap-4">
                        <Globe className="h-6 w-6 text-blue mt-1" />
                        <div>
                            <h3 className="text-xl font-bold">Social Media</h3>
                            <p className="text-slateMuted">Follow us and send us a message on our social channels.</p>
                             <div className="flex gap-4 mt-2">
                               <a href="#" className="text-blue font-semibold hover:underline">Twitter</a>
                               <a href="#" className="text-blue font-semibold hover:underline">LinkedIn</a>
                            </div>
                        </div>
                    </div>
                     <div className="flex gap-4">
                        <Building className="h-6 w-6 text-blue mt-1" />
                        <div>
                            <h3 className="text-xl font-bold">Main Office</h3>
                            <p className="text-slateMuted">123 Yonge Street, Toronto, ON, Canada</p>
                        </div>
                    </div>
                </div>
                <div>
                    <form className="space-y-4">
                        <Input placeholder="Your Name" className="bg-surface2 h-12 border-white/10" />
                        <Input type="email" placeholder="Your Email" className="bg-surface2 h-12 border-white/10" />
                        <Textarea placeholder="Your message..." className="bg-surface2 border-white/10 min-h-[150px]" />
                        <Button type="submit" size="lg" className="w-full bg-blue text-white hover:bg-blue/90">Send</Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
