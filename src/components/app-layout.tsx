
"use client";

import { Sidebar } from '@/components/ui/sidebar';
import { Suspense, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { NotificationsBell } from './notifications-bell';
import { BottomNav } from './bottom-nav';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';
import Image from 'next/image';

function AppSkeleton() {
    return (
        <main className="flex-1 space-y-8 p-4 md:p-8">
            <div className="space-y-2">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
            </div>
             <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                    <Skeleton className="h-96 w-full" />
                </div>
                <div className="space-y-8 md:col-span-1">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        </main>
    );
}


export function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // On desktop, the sidebar is collapsed by default.
  // On mobile, the sidebar is open by default when triggered.
  const collapsed = !isMobile && !sidebarOpen;

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed}/>
      <div className="flex-1 flex flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-4 lg:px-6 sticky top-0 z-30">
            <div className='flex items-center gap-2'>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:inline-flex">
                  {collapsed ? <Menu /> : <X />}
              </Button>
               <div className="lg:hidden">
                 <Link href="/dashboard" className="flex items-center gap-2">
                   <Image src="/logo.svg" alt="Logo" width={28} height={28} />
                   <span className="font-bold">Maple Leafs</span>
                 </Link>
              </div>
            </div>
            <div className="flex items-center gap-2">
                <NotificationsBell />
            </div>
        </header>
        <main className="flex-1 pb-16 lg:pb-0 overflow-y-auto">
           <Suspense fallback={<AppSkeleton />}>
            {children}
          </Suspense>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
