
import { SiteHeader } from '@/components/marketing/site-header';
import Image from 'next/image';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                    <FileText className="h-16 w-16 text-primary" />
                </div>
                <h1 className="text-4xl font-black tracking-tighter">Terms of Service</h1>
                <p className="text-muted-foreground mt-2 text-lg">Last updated: July 29, 2024</p>
            </header>
            
            <div className="prose dark:prose-invert max-w-none prose-lg prose-headings:font-bold prose-headings:tracking-tight prose-headings:border-b-2 prose-headings:border-primary/20 prose-headings:pb-2 prose-a:text-primary prose-a:font-semibold hover:prose-a:underline">
              <h2 id="acceptance">2.1 Acceptance</h2>
              <p>By creating an account or using any MLE services, you agree to these Terms, our Privacy Policy, and any product-specific agreements.</p>
              
              <h2 id="scope">2.2 Scope of Service</h2>
              <ul>
                <li>MLE provides <strong>software tools</strong> for study-permit preparation, college search, and immigration document automation.</li>
                <li><strong>Not legal advice:</strong> Unless explicitly stated, information is general. Representation before IRCC is provided <strong>only</strong> when you purchase a package that includes an RCIC retainer and sign <strong>Form IMM5476</strong>.</li>
              </ul>

              <h2 id="obligations">2.3 User Obligations</h2>
              <ul>
                <li>Provide accurate, lawful information; keep credentials secure.</li>
                <li>Upload documents you have the right to share; no malware or copyrighted material you do not own.</li>
                <li>Make timely payments; non-payment may suspend services.</li>
              </ul>

              <h2 id="refunds">2.4 Packages, Add-Ons & Refunds</h2>
              <ul>
                <li>Package descriptions and prices are shown on the Pricing page.</li>
                <li>Work begins after payment confirmation.</li>
                <li><strong>Refunds:</strong>
                  <ul>
                    <li>100% if you cancel within 24 hours and no work has begun.</li>
                    <li>70% for cancellations before document drafting.</li>
                    <li>0% once final documents are delivered or filing completed.</li>
                  </ul>
                </li>
                <li>Government fees (IRCC, VAC, courier) are non-refundable.</li>
              </ul>
              
              <h2 id="guarantee">2.5 No Outcome Guarantee</h2>
              <p>Visa issuance is at the sole discretion of IRCC. MLE cannot and does not guarantee approval. Any timelines are estimates.</p>

              <h2 id="ip">2.6 Intellectual Property</h2>
              <ul>
                <li>Platform code, text, graphics: © 2024–2025 MLE. All rights reserved.</li>
                <li>You are granted a revocable, non-exclusive license to use generated forms for your personal application only.</li>
              </ul>

              <h2 id="liability">2.7 Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, MLE’s aggregate liability shall not exceed the total fees paid by you in the <strong>12 months</strong> preceding the claim. MLE is not liable for indirect, incidental, or consequential damages, including lost opportunity or migration delays.</p>

              <h2 id="indemnity">2.8 Indemnity</h2>
              <p>You agree to indemnify and hold MLE, its officers, employees, and RCIC contractors harmless from any claims arising from your breach of these Terms or misuse of the Platform.</p>

              <h2 id="termination">2.9 Termination</h2>
              <ul>
                <li>You may close your account at any time; data retention rules apply.</li>
                <li>MLE may suspend or terminate access for violation of Terms, fraud, or non-payment.</li>
              </ul>

              <h2 id="disputes">2.10 Dispute Resolution</h2>
               <ul>
                  <li><strong>Step 1:</strong> Good-faith negotiation (30 days).</li>
                  <li><strong>Step 2:</strong> If unresolved, binding arbitration under the <strong>Arbitration Act (Ontario)</strong>; venue Toronto; language English.</li>
                  <li><strong>Step 3:</strong> Either party may seek injunctive relief in Superior Court for IP or confidentiality breaches.</li>
              </ul>

              <h2 id="law">2.11 Governing Law</h2>
              <p>These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada, without regard to conflict of law provisions.</p>

              <h2 id="force-majeure">2.12 Force Majeure</h2>
              <p>MLE is not liable for failures due to events beyond reasonable control: cyber-attacks, outages, strikes, pandemics, or government actions.</p>
              
              <h2 id="changes">2.13 Changes to Terms</h2>
              <p>MLE may modify these Terms; updated version posted 30 days before taking effect. Continued use = acceptance.</p>
              
              <h2 id="contact">2.14 Contact</h2>
              <p>
                  <a href="mailto:legal@mapleleafseducation.ca">legal@mapleleafseducation.ca</a> | <a href="tel:+14165551234">+1 (416) 555-1234</a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-card border-t">
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
