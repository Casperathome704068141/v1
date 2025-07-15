
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Briefcase, BarChart, ShieldCheck, CheckCircle, GraduationCap, Star } from 'lucide-react';
import Image from 'next/image';
import { SiteHeader } from '@/components/marketing/site-header';

export default function MarketingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 bg-gray-100 dark:bg-gray-800">
          <div className="absolute inset-0">
            <Image
              src="/login-background.jpg"
              alt="Students studying in Canada"
              layout="fill"
              objectFit="cover"
              priority
              className="opacity-20"
              data-ai-hint="university students"
            />
            <div className="absolute inset-0 bg-background/60" />
          </div>
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-headline tracking-tighter text-foreground">
                Beat the Canadian Study Permit Caps. Let Our AI Find Your Way.
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
                Get a smarter college match with AI and a final review from a certified Canadian immigration consultant to ensure you qualify.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="font-bold">
                  <Link href="/signup">Check Your Eligibility</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                   <Link href="/login">Log In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Your Complete Study Permit Toolkit</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From finding the right school to final submission, our platform guides you every step of the way.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold flex items-center gap-2"><GraduationCap className="h-6 w-6 text-primary" /> AI College Matching</h3>
                  <p className="text-muted-foreground">
                    Our AI analyzes your profile against thousands of programs to find the best DLI for you.
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold flex items-center gap-2"><BarChart className="h-6 w-6 text-primary" /> Eligibility Scoring</h3>
                  <p className="text-muted-foreground">
                    Take our quiz to instantly see your application strength and get an AI-generated action plan.
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold flex items-center gap-2"><ShieldCheck className="h-6 w-6 text-primary" /> RCIC Final Review</h3>
                  <p className="text-muted-foreground">
                    Get peace of mind with an expert review from a Regulated Canadian Immigration Consultant.
                  </p>
                </div>
              </div>
               <div className="flex items-center justify-center">
                  <Image
                    src="/feature-image.png"
                    width="310"
                    height="500"
                    alt="Feature"
                    className="mx-auto aspect-[9/16] overflow-hidden rounded-xl object-cover object-center"
                    data-ai-hint="app screenshot"
                  />
               </div>
                <div className="flex flex-col justify-center space-y-4">
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold flex items-center gap-2"><CheckCircle className="h-6 w-6 text-primary" /> Guided Application</h3>
                  <p className="text-muted-foreground">
                    Fill out your application step-by-step, with guidance at every stage.
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold flex items-center gap-2"><Star className="h-6 w-6 text-primary" /> SOP Generator</h3>
                  <p className="text-muted-foreground">
                   Create a strong, personalized Statement of Purpose with help from our AI assistant.
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold flex items-center gap-2"><Briefcase className="h-6 w-6 text-primary" /> Document Locker</h3>
                  <p className="text-muted-foreground">
                    Securely upload and manage all your required documents in one place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Maple Leafs Education. A BENO 1017 Product.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
