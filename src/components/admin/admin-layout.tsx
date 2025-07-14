
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, Settings, LogOut, BarChart3, Newspaper, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function UserMenu() {
  const router = useRouter();

  const handleSignOut = () => {
    // In a real app, clear admin session/token
    router.replace('/admin/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={"https://placehold.co/100x100.png"} alt="Admin" data-ai-hint="user avatar" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Admin User</p>
            <p className="text-xs leading-none text-muted-foreground">admin@mapleleafs.edu</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/applications', icon: FileText, label: 'Applications' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/payments', icon: CreditCard, label: 'Payments' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/admin/cms', icon: Newspaper, label: 'News CMS' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="p-2">
            <div className="flex h-12 items-center justify-center">
              <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
                <Image
                  src="/logo.svg"
                  alt="Maple Leafs Education Logo"
                  width={32}
                  height={32}
                  className="shrink-0"
                />
                <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
                  <span className="text-lg font-bold text-sidebar-foreground leading-tight">
                    Maple Leafs
                  </span>
                  <span className="text-xs text-sidebar-foreground/80 leading-tight">
                    Education Admin
                  </span>
                </div>
              </Link>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton isActive={pathname.startsWith(item.href)}>
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="px-2 py-2 text-xs text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
              <p className="px-2">A BENO 1017 PRODUCT. ALL RIGHTS RESERVED</p>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:justify-end">
            <SidebarTrigger className="sm:hidden" />
            <UserMenu />
          </header>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
