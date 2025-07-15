
import { SiteHeader } from '@/components/marketing/site-header';
import Image from 'next/image';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold font-headline mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: July 29, 2024</p>
            
            <div className="prose lg:prose-lg max-w-none text-muted-foreground">
                <p>Welcome to Maple Leafs Education ("us", "we", or "our"). We operate the https://mapleleafseducation.ca website (the "Service").</p>
                <p>This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data. We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.</p>

                <h2>Information Collection and Use</h2>
                <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
                <h3>Types of Data Collected</h3>
                <h4>Personal Data</h4>
                <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:</p>
                <ul>
                    <li>Email address</li>
                    <li>First name and last name</li>
                    <li>Phone number</li>
                    <li>Address, State, Province, ZIP/Postal code, City</li>
                    <li>Cookies and Usage Data</li>
                </ul>

                <h2>Use of Data</h2>
                <p>Maple Leafs Education uses the collected data for various purposes:</p>
                <ul>
                    <li>To provide and maintain the Service</li>
                    <li>To notify you about changes to our Service</li>
                    <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                    <li>To provide customer care and support</li>
                    <li>To provide analysis or valuable information so that we can improve the Service</li>
                    <li>To monitor the usage of the Service</li>
                    <li>To detect, prevent and address technical issues</li>
                </ul>

                <h2>Security of Data</h2>
                <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>

                <h2>Changes to This Privacy Policy</h2>
                <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy.</p>
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
