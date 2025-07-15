
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';
import { SiteHeader } from '@/components/marketing/site-header';

const teamMembers = [
  {
    name: 'Benoît Clouâtre, RCIC',
    role: 'Founder & Lead Consultant',
    avatar: 'https://avatar.vercel.sh/benoit.png',
    bio: 'With over 15 years in Canadian immigration, Benoît founded MLE to demystify the study permit process. His vision is to blend cutting-edge AI with personalized, human expertise to help students worldwide achieve their dreams.',
    socials: { linkedin: '#', twitter: '#' }
  },
  {
    name: 'Aisha Khan',
    role: 'Head of Product & AI',
    avatar: 'https://avatar.vercel.sh/aisha.png',
    bio: 'Aisha leads the development of our AI-powered platform. A former international student herself, she is passionate about using technology to create transparent and accessible pathways to Canadian education for everyone.',
    socials: { linkedin: '#', twitter: '#' }
  },
   {
    name: 'Samuel Adebayo',
    role: 'Student Success Lead',
    avatar: 'https://avatar.vercel.sh/samuel.png',
    bio: 'Samuel is the voice of our students. He ensures every user has the support they need, from their first eligibility quiz to their final application submission. He is dedicated to providing empathetic and timely assistance.',
    socials: { linkedin: '#', twitter: '#' }
  }
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 bg-primary/5">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tighter text-foreground">
                Our Mission: Simplifying Your Path to Canada
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
                We believe that every aspiring student deserves a clear, honest, and accessible route to a Canadian education. Maple Leafs Education was founded to replace confusion with clarity, and anxiety with confidence.
              </p>
            </div>
          </div>
        </section>
        
        {/* Story Section */}
        <section className="w-full py-12 md:py-24">
            <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                    <span className="text-sm font-semibold uppercase text-primary">The MLE Difference</span>
                    <h2 className="text-3xl font-bold tracking-tighter">Combining AI Efficiency with Human Empathy</h2>
                    <p className="text-muted-foreground">
                        The Canadian study permit process is more competitive than ever. Simple mistakes or a poorly presented case can lead to refusals, dashing dreams and wasting time and money. We saw too many talented students getting rejected for avoidable reasons.
                    </p>
                    <p className="text-muted-foreground">
                        That's why we built Maple Leafs Education. Our platform uses artificial intelligence to handle the heavy lifting—matching you with the right colleges, generating personalized action plans, and helping you draft key documents. But we know technology isn't enough. Every high-stakes application is given a final quality assurance check by a Regulated Canadian Immigration Consultant (RCIC) to ensure it's compliant, compelling, and ready for success.
                    </p>
                </div>
                <div>
                     <Image
                        src="https://placehold.co/600x400.png"
                        alt="Team working collaboratively"
                        width={600}
                        height={400}
                        className="rounded-xl shadow-lg"
                        data-ai-hint="diverse team working"
                    />
                </div>
            </div>
        </section>

        {/* Team Section */}
        <section className="w-full py-12 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Meet the Team</h2>
              <p className="max-w-2xl mx-auto mt-4 text-muted-foreground md:text-lg">
                The experts dedicated to your success.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {teamMembers.map((member) => (
                <Card key={member.name} className="text-center">
                  <CardHeader className="items-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={member.avatar} alt={member.name} data-ai-hint="professional headshot" />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription className="text-primary font-semibold">{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                    <div className="mt-4 flex justify-center gap-4">
                        <Link href={member.socials.linkedin}><Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
                        <Link href={member.socials.twitter}><Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
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
