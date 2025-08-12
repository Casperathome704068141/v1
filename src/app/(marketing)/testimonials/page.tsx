
'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
    { name: "Fatima Al-Jamil", country: "United Arab Emirates", program: "University of Toronto, Engineering", quote: "The AI match was incredibly accurate, and the RCIC review caught a mistake that would have cost me my visa. I felt supported every step of the way.", image: "https://placehold.co/100x100.png", aiHint: "woman headshot" },
    { name: "Samuel Adebayo", country: "Nigeria", program: "Seneca Polytechnic, IT", quote: "Maple Leafs Education made the document checklist so easy. I knew exactly what I needed, and the SOP generator was a lifesaver.", image: "https://placehold.co/100x100.png", aiHint: "man headshot" },
    { name: "Priya Sharma", country: "India", program: "UBC, Business", quote: "I was overwhelmed, but the step-by-step process broke it down perfectly. The dashboard kept me on track. Worth every penny.", image: "https://placehold.co/100x100.png", aiHint: "woman professional" },
    { name: "Carlos Rossi", country: "Brazil", program: "Conestoga College, Culinary Arts", quote: "My application was complicated due to a previous refusal. The Elite plan was fantastic; my consultant handled everything with such professionalism.", image: "https://placehold.co/100x100.png", aiHint: "man smiling" },
    { name: "Aisha Khan", country: "Pakistan", program: "McMaster University, Health Sciences", quote: "The clarity and confidence this platform gave me was priceless. I wasn't just submitting forms; I was building a strong case for my future.", image: "https://placehold.co/100x100.png", aiHint: "student portrait" },
    { name: "Kenji Tanaka", country: "Japan", program: "BCIT, Mechanical Engineering", quote: "From finding the right polytechnic to organizing my financials, the platform was a perfect blend of technology and human expertise.", image: "https://placehold.co/100x100.png", aiHint: "professional man" }
];

export default function TestimonialsPage() {
    return (
        <div className="container mx-auto py-24 md:py-32">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
            >
                <h1 className="font-display text-4xl md:text-5xl text-balance">
                    Success Stories From Around the World
                </h1>
                <p className="mt-4 text-lg text-slateMuted max-w-3xl mx-auto text-balance">
                    Don't just take our word for it. Hear from students who successfully navigated their journey to Canada with our help.
                </p>
            </motion.div>

            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {testimonials.map((testimonial, index) => (
                     <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="bg-surface1 p-8 rounded-lg border border-white/10 break-inside-avoid"
                     >
                        <p className="text-white text-lg italic">"{testimonial.quote}"</p>
                        <div className="flex items-center mt-6">
                            <Image
                                src={testimonial.image}
                                alt={testimonial.name}
                                width={50}
                                height={50}
                                className="rounded-full"
                                data-ai-hint={testimonial.aiHint}
                            />
                            <div className="ml-4">
                                <p className="font-bold text-white">{testimonial.name}</p>
                                <p className="text-sm text-slateMuted">{testimonial.program}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
