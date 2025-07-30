
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#testimonials", label: "Testimonials" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/support", label: "Support" },
];

export function SiteHeader() {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image
            src="/logo-full.svg"
            alt="Maple Leafs Education"
            width={40}
            height={40}
            className="transform transition hover:scale-110"
          />
          <span className="font-bold sm:inline-block">Maple Leafs Education</span>
        </Link>
        <nav className="hidden flex-1 items-center gap-6 text-sm md:flex">
          {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                  {link.label}
              </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {!loading && (
            <>
              {user ? (
                <Button asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <div className="hidden md:flex md:items-center md:space-x-2">
                  <Button asChild variant="ghost">
                     <Link href="/login">Log In</Link>
                  </Button>
                   <Button asChild>
                     <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </>
          )}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-card">
                <Link href="/" className="mr-6 flex items-center space-x-2 mb-6" onClick={() => setIsOpen(false)}>
                    <Image
                      src="/logo-full.svg"
                      alt="Maple Leafs Education"
                      width={40}
                      height={40}
                      className="transform transition hover:scale-110"
                    />
                    <span className="font-bold">Maple Leafs Education</span>
                </Link>
                <div className="flex flex-col gap-4">
                     {navLinks.map(link => (
                        <Link key={link.href} href={link.href} className="text-muted-foreground transition-colors hover:text-foreground text-lg" onClick={() => setIsOpen(false)}>
                            {link.label}
                        </Link>
                    ))}
                    {!user && !loading && (
                        <>
                            <hr className="my-2" />
                             <Link href="/login" className="text-muted-foreground transition-colors hover:text-foreground text-lg" onClick={() => setIsOpen(false)}>Log In</Link>
                             <Link href="/signup" className="text-muted-foreground transition-colors hover:text-foreground text-lg" onClick={() => setIsOpen(false)}>Sign Up</Link>
                        </>
                    )}
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
