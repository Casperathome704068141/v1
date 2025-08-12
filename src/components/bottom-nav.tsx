
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/application', icon: FileText, label: 'Apply' },
  { href: '/college-match', icon: Search, label: 'Match' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-surface2 border-t border-white/10 p-2 flex justify-around md:hidden z-20">
      {navItems.map(item => (
        <Link 
          key={item.href}
          href={item.href} 
          className={cn(
            "flex flex-col items-center text-xs w-1/4 py-1 rounded-md transition-colors",
            pathname === item.href ? 'text-blue bg-blue/10' : 'text-slateMuted'
            )}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
