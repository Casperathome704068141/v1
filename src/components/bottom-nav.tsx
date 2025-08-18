
"use client";

import { useUser } from '@/hooks/use-user';
import { studentMenuItems, adminMenuItems } from '@/lib/menu-items';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const { profile } = useUser();
  const pathname = usePathname();
  const menuItems = profile?.role === 'admin' ? adminMenuItems.slice(0, 4) : studentMenuItems.slice(0, 4);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 flex justify-around">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex flex-col items-center w-full p-2 rounded-lg transition-colors',
            pathname === item.href
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <item.icon className="w-6 h-6" />
          <span className="text-xs mt-1">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
