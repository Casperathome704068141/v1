
import { SiteHeader } from '@/components/marketing/site-header';
import Image from 'next/image';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold font-headline mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: July 29, 2024</p>
            
            <div className="space-y-6 text-muted-foreground leading-relaxed">
                <section>
                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">1.1 Introduction</h2>
                    <p>This Privacy Policy explains how MLE collects, uses, discloses, and protects the personal information of users (“you”) who access our web and mobile applications (the “Platform”).</p>
                    <p>By using the Platform, you consent to the practices described below.</p>
                </section>
                
                <section>
                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">1.2 What We Collect</h2>
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="min-w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-3 font-semibold text-left">Category</th>
                                    <th className="p-3 font-semibold text-left">Examples</th>
                                    <th className="p-3 font-semibold text-left">Purpose</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="p-3 align-top"><strong>Account Data</strong></td>
                                    <td className="p-3 align-top">Name, email, password hash, phone, address, country</td>
                                    <td className="p-3 align-top">Account creation, authentication, communication</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="p-3 align-top"><strong>Immigration Data</strong></td>
                                    <td className="p-3 align-top">Date of birth, passport details, education/work history, finances, LOA, family info, uploaded documents</td>
                                    <td className="p-3 align-top">Generating IRCC forms, SOP drafts, eligibility scoring</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="p-3 align-top"><strong>Payment Data</strong></td>
                                    <td className="p-3 align-top">Last four digits of card, transaction ID (via Stripe), billing address</td>
                                    <td className="p-3 align-top">Processing fees, refunds, tax records</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="p-3 align-top"><strong>Usage Data</strong></td>
                                    <td className="p-3 align-top">IP address, device type, pages visited, quiz scores</td>
                                    <td className="p-3 align-top">Analytics, fraud prevention, product improvement</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="p-3 align-top"><strong>Cookies & Similar Tech</strong></td>
                                    <td className="p-3 align-top">Session cookie, analytics cookie, CSRF token</td>
                                    <td className="p-3 align-top">Maintain login state, measure traffic</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
                
                <section>
                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">1.3 Legal Basis & Use</h2>
                    <p>We process data under at least one of the following grounds:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li><strong>Contractual necessity</strong> – to deliver purchased services.</li>
                        <li><strong>Legitimate interest</strong> – to improve features, prevent abuse.</li>
                        <li><strong>Consent</strong> – when you voluntarily provide sensitive data (e.g., medical info).</li>
                        <li><strong>Legal obligation</strong> – compliance with Canadian tax/law‐society rules.</li>
                    </ul>
                </section>
                
                <section>
                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">1.4 Sharing & Disclosure</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Internal Staff & RCICs</strong> bound by confidentiality agreements.</li>
                        <li><strong>Service Providers</strong> (Stripe, AWS, Google Cloud, Algolia, Twilio) – data shared only to the extent necessary and under DPA.</li>
                        <li><strong>Educational Institutions (DLIs)</strong> – only with your explicit instruction for LOA applications.</li>
                        <li><strong>Government Agencies</strong> – if you ask us to submit forms on your behalf or when legally compelled (court order, subpoena).</li>
                        <li><strong>Business Transfers</strong> – data may be transferred in M&A events; you will be notified.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">1.5 International Transfers</h2>
                    <p>MLE servers are in Canada (East) with backups in the U.S. Where data leaves Canada, we rely on SCCs or equivalent safeguards.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">1.6 Retention</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Account & immigration files: <strong>7 years</strong> after last transaction (CRA & ICCRC compliance).</li>
                        <li>Payment logs: 10 years under FINTRAC rules.</li>
                        <li>Quiz/analytics logs: 24 months, then anonymized.</li>
                    </ul>
                </section>
                
                <section>
                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">1.7 Your Rights</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Access / download a copy of your data.</li>
                        <li>Correct inaccuracies.</li>
                        <li>Delete (subject to legal retention).</li>
                        <li>Withdraw consent (future processing).</li>
                        <li>Object to direct marketing.</li>
                    </ul>
                    <p className="mt-2">Contact <a href="mailto:privacy@mapleleafseducation.ca" className="text-primary hover:underline">privacy@mapleleafseducation.ca</a>. We respond within 30 days.</p>
                </section>
                
                <section>
                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">1.8 Security</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>AES-256 at rest; TLS 1.3 in transit.</li>
                        <li>Role-based access; MFA for staff.</li>
                        <li>Annual penetration tests; SOC 2 report available on NDA.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">1.9 Children</h2>
                    <p>Platform not directed to persons under <strong>16</strong>. We do not knowingly collect data from minors without parental consent.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">1.10 Changes</h2>
                    <p>We may update this Policy; material changes will be emailed 30 days in advance.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">1.11 Contact</h2>
                    <p>
                        Maple Leafs Education Inc.<br/>
                        123 Front St W, Suite 456, Toronto ON M5J 2M2<br/>
                        <a href="mailto:privacy@mapleleafseducation.ca" className="text-primary hover:underline">privacy@mapleleafseducation.ca</a>
                    </p>
                </section>
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
