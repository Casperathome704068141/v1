
import { SiteHeader } from '@/components/marketing/site-header';
import Image from 'next/image';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold font-headline mb-4">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: July 29, 2024</p>
            
            <div className="prose lg:prose-lg max-w-none text-muted-foreground">
                <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the https://mapleleafseducation.ca website (the "Service") operated by Maple Leafs Education ("us", "we", or "our").</p>
                <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.</p>
                <p>By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</p>

                <h2>Accounts</h2>
                <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
                <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.</p>

                <h2>Intellectual Property</h2>
                <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Maple Leafs Education and its licensors. The Service is protected by copyright, trademark, and other laws of both Canada and foreign countries.</p>

                <h2>Disclaimer</h2>
                <p>Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.</p>
                <p>Maple Leafs Education does not guarantee any specific outcome for your study permit application. Our services are for guidance and preparation purposes only. The final decision rests with Immigration, Refugees and Citizenship Canada (IRCC).</p>

                <h2>Governing Law</h2>
                <p>These Terms shall be governed and construed in accordance with the laws of the province of Ontario, Canada, without regard to its conflict of law provisions.</p>
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
