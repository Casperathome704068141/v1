
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BrainCircuit, CheckCircle, GraduationCap, ShieldCheck, Star, ArrowRight, Target, BarChart, MoveRight } from 'lucide-react';
import Image from 'next/image';
import { SiteHeader } from '@/components/marketing/site-header';
import { Badge } from '@/components/ui/badge';

const testimonials = [
  {
    name: "Fatima Al-Hassan",
    country: "Nigeria",
    avatar: "https://avatar.vercel.sh/fatima.png",
    stars: 5,
    title: "From a visa refusal to an approval in 6 weeks!",
    story: "I was devastated after my first refusal. Maple Leafs' AI found a better-suited program, and their RCIC helped me write a powerful SOP that explained my study gap. I couldn't have done it without them. My permit was approved, and I'm now studying at Conestoga College!"
  },
  {
    name: "Ken Omondi",
    country: "Kenya",
    avatar: "https://avatar.vercel.sh/ken.png",
    stars: 5,
    title: "The AI college match was a game-changer.",
    story: "I was overwhelmed with options. The College Match tool narrowed it down to three perfect colleges based on my budget and grades that I hadn't even considered. The detailed reasoning helped me choose with confidence. The whole process felt so clear and organized."
  },
  {
    name: "Priya Sharma",
    country: "India",
    avatar: "https://avatar.vercel.sh/priya.png",
    stars: 5,
    title: "Made a complex process feel simple and secure.",
    story: "As a mature student changing careers, I was worried my application wasn't strong enough. The AI Action Plan and the SOP generator were incredible tools. The final review from their RCIC gave me the peace of mind I needed to submit. I highly recommend their platform."
  }
];


export default function MarketingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full pt-20 pb-24 md:pt-32 md:pb-32 lg:pt-40 lg:pb-40 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
            <div
              className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-30 dark:opacity-50 animate-background-pan"
              style={{
                backgroundSize: '200% 200%',
              }}
            />
          </div>
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10 animate-fade-in-up">
            <Badge
              variant="secondary"
              className="mb-6 animate-fade-in-up [animation-delay:200ms] bg-white/20 backdrop-blur-sm border-primary/30 text-primary-foreground"
            >
              Now with PAL & SDS support for 2025
              <MoveRight className="ml-2 h-4 w-4" />
            </Badge>
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-foreground text-balance animate-fade-in-up [animation-delay:400ms]">
                Your Smartest Path to a Canadian Education
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground text-balance animate-fade-in-up [animation-delay:600ms]">
                Navigate study permit caps and find the perfect college with our AI-powered platform, guided by certified immigration consultants.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up [animation-delay:800ms]">
                <Button asChild size="lg" className="font-semibold text-base bg-electric-violet hover:bg-[#8A2BE2]/90 text-white shadow-lg transition-transform duration-200 hover:scale-105">
                  <Link href="/signup">Check Eligibility Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="transition-colors duration-200 hover:bg-primary/10">
                   <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-balance">Your Application Journey, Simplified</h2>
              <p className="max-w-2xl mx-auto mt-4 text-muted-foreground md:text-lg text-balance">
                We've distilled the complex study permit process into a clear, intelligent, and guided path to success.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-6 rounded-lg hover:bg-background transition-colors duration-300">
                <div className="flex items-center justify-center mb-4 h-16 w-16 rounded-full bg-primary/10 mx-auto ring-4 ring-primary/20">
                  <BarChart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">1. Assess Profile</h3>
                <p className="text-muted-foreground mt-2">Take our free Eligibility Quiz to instantly see your application strength and get an AI-generated action plan.</p>
              </div>
              <div className="text-center p-6 rounded-lg hover:bg-background transition-colors duration-300">
                <div className="flex items-center justify-center mb-4 h-16 w-16 rounded-full bg-primary/10 mx-auto ring-4 ring-primary/20">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">2. Find Your Match</h3>
                <p className="text-muted-foreground mt-2">Our AI analyzes your profile against thousands of programs to find Designated Learning Institutions that are a perfect fit.</p>
              </div>
              <div className="text-center p-6 rounded-lg hover:bg-background transition-colors duration-300">
                <div className="flex items-center justify-center mb-4 h-16 w-16 rounded-full bg-primary/10 mx-auto ring-4 ring-primary/20">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">3. Build Application</h3>
                <p className="text-muted-foreground mt-2">Use our guided forms, document checklists, and AI-powered SOP generator to build a strong, complete application package.</p>
              </div>
              <div className="text-center p-6 rounded-lg hover:bg-background transition-colors duration-300">
                <div className="flex items-center justify-center mb-4 h-16 w-16 rounded-full bg-primary/10 mx-auto ring-4 ring-primary/20">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">4. Expert Review</h3>
                <p className="text-muted-foreground mt-2">Before you submit, have your entire application reviewed by a Regulated Canadian Immigration Consultant (RCIC).</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-12 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-balance">Success Stories from Students Like You</h2>
              <p className="max-w-2xl mx-auto mt-4 text-muted-foreground md:text-lg text-balance">
                See how Maple Leafs Education has helped students from around the world achieve their Canadian dreams.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="flex flex-col bg-card border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-primary/50">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint="student portrait" />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base font-bold">{testimonial.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{testimonial.country}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex mb-2">
                      {[...Array(testimonial.stars)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{testimonial.title}</h4>
                    <p className="text-muted-foreground text-sm">"{testimonial.story}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="w-full py-20 md:py-32 bg-card">
           <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-balance">Ready to Start Your Journey?</h2>
                <p className="mt-4 text-lg text-muted-foreground text-balance">
                    Your Canadian education is closer than you think. Take the first step today by checking your eligibility. It's free, fast, and gives you a clear action plan.
                </p>
                <div className="mt-8">
                    <Button asChild size="lg" className="font-semibold text-base w-full sm:w-auto bg-electric-violet hover:bg-[#8A2BE2]/90 text-white shadow-lg transition-transform duration-200 hover:scale-105">
                        <Link href="/signup">Get Started for Free</Link>
                    </Button>
                </div>
            </div>
           </div>
        </section>
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
                 <Link href="/pricing" className="hover:text-primary hover:underline">Pricing</Link>
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
