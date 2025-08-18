
"use client";

import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "The advisors were incredibly helpful and guided me through every step of the process. I couldn't have done it without them!",
    author: "Fatima Al-Fassi, Morocco",
  },
  {
    quote: "I was overwhelmed with all the college options, but Maple Leafs Education helped me find the perfect fit for my career goals.",
    author: "Chen Wei, China",
  },
  {
    quote: "The visa application process was so stressful, but the team at Maple Leafs made it a breeze. I'm now studying in my dream program in Toronto!",
    author: "Aditya Sharma, India",
  },
    {
    quote: "I highly recommend Maple Leafs Education to any student looking to study in Canada. They are professional, knowledgeable, and truly care about your success.",
    author: "Isabella Rossi, Italy",
  },
];

export function TestimonialMarquee() {
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="relative w-full overflow-hidden">
      <motion.div
        className="flex"
        animate={{
          x: ['-100%', '0%'],
          transition: {
            ease: 'linear',
            duration: 30,
            repeat: Infinity,
          },
        }}
      >
        {duplicatedTestimonials.map((testimonial, index) => (
          <div key={index} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 p-4">
            <div className="p-6 rounded-lg shadow-lg bg-card">
              <p className="text-lg italic">"{testimonial.quote}"</p>
              <p className="mt-4 text-right font-semibold text-primary">- {testimonial.author}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
