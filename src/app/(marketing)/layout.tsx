
import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/marketing/site-header';
import Link from 'next/link';
import Image from 'next/image';

function SiteFooter() {
    return (
        <footer className="border-t border-white/10 py-12">
            <div className="container mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
                <div className="col-span-2 md:col-span-2 space-y-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image src="/logo.svg" alt="Maple Leafs Education Logo" width={32} height={32} />
                        <span className="font-bold text-lg">Maple Leafs Education</span>
                    </Link>
                    <p className="text-sm text-slateMuted max-w-xs">
                        AI speed + RCIC accuracy to pick your college, build your file, and apply with confidence.
                    </p>
                    <p className="text-xs text-slateMuted/50">&copy; {new Date().getFullYear()} Maple Leafs Education. All rights reserved.</p>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Platform</h4>
                    <nav className="flex flex-col gap-2 text-slateMuted">
                        <Link href="/how-it-works" className="hover:text-white">How It Works</Link>
                        <Link href="/pricing" className="hover:text-white">Pricing</Link>
                        <Link href="/testimonials" className="hover:text-white">Testimonials</Link>
                    </nav>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Company</h4>
                    <nav className="flex flex-col gap-2 text-slateMuted">
                        <Link href="/about" className="hover:text-white">About Us</Link>
                        <Link href="/contact" className="hover:text-white">Contact</Link>
                        <Link href="/support" className="hover:text-white">Support</Link>
                    </nav>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Legal</h4>
                    <nav className="flex flex-col gap-2 text-slateMuted">
                        <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white">Terms of Service</Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-navy text-white">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
