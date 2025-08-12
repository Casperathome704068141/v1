
'use client';
import { motion } from 'framer-motion';
import { FileCheck, Search, MessageSquare, GraduationCap, Plane } from 'lucide-react';

const steps = [
    {
        icon: FileCheck,
        title: "Sign Up & Complete Profile",
        description: "Start by creating your free account. Our guided form helps you build a comprehensive profile, capturing all the key details IRCC needs to know."
    },
    {
        icon: Search,
        title: "Find Your Perfect College Match",
        description: "Our AI analyzes your profile against hundreds of programs to find the best-fit colleges and universities for you, maximizing your chances of acceptance."
    },
    {
        icon: MessageSquare,
        title: "Consult with an RCIC",
        description: "Book a session with a Regulated Canadian Immigration Consultant to review your strategy, strengthen your application, and get answers to your toughest questions."
    },
    {
        icon: GraduationCap,
        title: "Build & Submit Your Application",
        description: "Use our tools to auto-fill forms, generate a strong Statement of Purpose, and organize your documents. We'll give it a final expert review before you submit."
    },
    {
        icon: Plane,
        title: "Get Your Visa & Fly to Canada",
        description: "Track your application status on your dashboard. Once approved, we provide pre-departure guidance to ensure you're ready for your new life in Canada."
    }
];

export default function HowItWorksPage() {
    return (
        <div className="container mx-auto py-24 md:py-32">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
            >
                <h1 className="font-display text-4xl md:text-5xl text-balance">
                    From Dream to DLI: Your 5-Step Journey
                </h1>
                <p className="mt-4 text-lg text-slateMuted max-w-3xl mx-auto text-balance">
                    We've simplified the entire process into a clear, manageable path. Here’s exactly how we get you from where you are to your first day of class in Canada.
                </p>
            </motion.div>

            <div className="relative max-w-2xl mx-auto">
                {/* The vertical line */}
                <div className="absolute left-6 md:left-1/2 top-6 h-full w-0.5 bg-white/10 -translate-x-1/2" aria-hidden="true"></div>

                <div className="space-y-16">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isEven = index % 2 === 0;

                        return (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: 0.6 }}
                                className="relative flex items-start md:items-center"
                            >
                                <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-blue flex items-center justify-center text-white z-10 shadow-lg shadow-blue/20`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className={`w-full ml-8 md:ml-0 md:w-1/2 ${isEven ? 'md:pl-12' : 'md:pr-12 md:text-right'}`}>
                                    <h3 className="font-display text-2xl text-white">{step.title}</h3>
                                    <p className="mt-2 text-slateMuted">{step.description}</p>
                                </div>
                                <div className={`hidden md:block w-1/2 ${isEven ? 'md:order-first' : ''}`}></div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
