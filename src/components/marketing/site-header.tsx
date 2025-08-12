
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const navLinks = [
    { href: "/how-it-works", label: "How It Works" },
    { href: "/pricing", label: "Pricing" },
    { href: "/testimonials", label: "Success Stories" },
    { href: "/support", label: "Support" },
];

export function SiteHeader() {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const closeSheet = () => setIsOpen(false);

  return (
    <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        hasScrolled ? "bg-navy/80 backdrop-blur-lg border-b border-white/10" : "bg-transparent"
    )}>
      <div className="container flex h-20 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="Maple Leafs Education"
            width={40}
            height={40}
            className="transform transition hover:scale-110"
          />
          <span className="font-bold sm:inline-block">Maple Leafs Education</span>
        </Link>
        <nav className="hidden flex-1 items-center gap-6 text-sm md:flex">
          {navLinks.map(link => (
              <Link key={link.href} href={link.href} className={cn("transition-colors hover:text-white", pathname === link.href ? "text-white" : "text-slateMuted")}>
                  {link.label}
              </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {!loading && (
            <div className="hidden md:flex md:items-center md:space-x-2">
              {user ? (
                <Button asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="ghost" className="hover:bg-white/10">
                     <Link href="/login">Sign In</Link>
                  </Button>
                   <Button asChild className="bg-red text-white hover:bg-red/90">
                     <Link href="/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          )}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-white/10">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-surface1 border-r-white/10 w-full p-0">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2" onClick={closeSheet}>
                        <Image src="/logo.svg" alt="Maple Leafs Education" width={32} height={32}/>
                        <span className="font-bold">Maple Leafs Education</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={closeSheet}><X/></Button>
                </div>
                <div className="flex flex-col p-4 space-y-4">
                     {navLinks.map(link => (
                        <Link key={link.href} href={link.href} className="text-slateMuted transition-colors hover:text-white text-lg" onClick={closeSheet}>
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-4 space-y-2">
                        {user ? (
                            <Button asChild size="lg" className="w-full">
                              <Link href="/dashboard" onClick={closeSheet}>Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild size="lg" variant="outline" className="w-full border-slateMuted text-slateMuted hover:bg-white/10 hover:text-white">
                                 <Link href="/login" onClick={closeSheet}>Sign In</Link>
                                </Button>
                               <Button asChild size="lg" className="w-full bg-red text-white hover:bg-red/90">
                                 <Link href="/signup" onClick={closeSheet}>Get Started</Link>
                              </Button>
                            </>
                        )}
                    </div>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
