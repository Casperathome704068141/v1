
"use client";

import { BottomNav } from '@/components/bottom-nav';
import { Sidebar } from '@/components/ui/sidebar';
import { FullPageLoader } from '@/components/ui/loader';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { NotificationsBell } from './notifications-bell';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => {
        // A slight delay to allow the animation to feel smoother
        setTimeout(() => setLoading(false), 300);
    };

    handleStart();
    handleComplete();

  }, [pathname, searchParams]);

  return (
    <div className="flex">
      <Sidebar collapsed={sidebarCollapsed}/>
      <div className="flex-1 flex flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-4 lg:px-6">
            <Button variant="ghost" size="icon" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden lg:inline-flex">
                {sidebarCollapsed ? <Menu /> : <X />}
            </Button>
            <div className="lg:hidden">
                {/* Mobile header content can go here */}
            </div>
            <div className="flex-1" />
            <NotificationsBell />
        </header>
        <main className="flex-1 pb-16 lg:pb-0 overflow-y-auto">
            <AnimatePresence mode="wait">
                {loading && <FullPageLoader />}
            </AnimatePresence>
            {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
