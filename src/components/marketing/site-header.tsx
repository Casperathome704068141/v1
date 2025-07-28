
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

const navLinks = [
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#testimonials", label: "Testimonials" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/support", label: "Support" },
];

function ThemeToggle() {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    return (
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}

export function SiteHeader() {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image src="/logo.svg" alt="Maple Leafs Education Logo" width={32} height={32} />
          <span className="font-bold sm:inline-block font-headline">Maple Leafs Education</span>
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
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <Link href="/" className="mr-6 flex items-center space-x-2 mb-6" onClick={() => setIsOpen(false)}>
                    <Image src="/logo.svg" alt="Maple Leafs Education Logo" width={32} height={32} />
                    <span className="font-bold font-headline">Maple Leafs Education</span>
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
