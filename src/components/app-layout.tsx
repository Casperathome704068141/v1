
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
import { GraduationCap, LayoutDashboard, Search, Settings, Wallet, FileText, Calendar, LifeBuoy, LogOut, DollarSign } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

function UserMenu() {
  const { user, signOut } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.photoURL || "https://placehold.co/100x100.png"} alt="User" data-ai-hint="user avatar" />
            <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.displayName || 'Student User'}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email || 'student@example.com'}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/eligibility-quiz', icon: FileText, label: 'Eligibility Quiz' },
  { href: '/college-match', icon: Search, label: 'College Match' },
  { href: '/application', icon: GraduationCap, label: 'Application' },
  { href: '/documents', icon: FileText, label: 'Documents' },
  { href: '/appointments', icon: Calendar, label: 'Appointments' },
  { href: '/pricing', icon: DollarSign, label: 'Pricing' },
  { href: '/support', icon: LifeBuoy, label: 'Support' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-3 p-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-sidebar-foreground"><path d="M12 22l-2-2 4-4 2 2-4 4z"/><path d="M18 16l-4-4 2-2 4 4-2 2z"/><path d="M12.5 7.5L10 5 2 13l2 2 2.5-2.5L10 10l-2 2 2 2 2-2 2.5 2.5L13 13l7-7-2-2-2.5 2.5L13 10l-2-2 1.5-1.5z"/><path d="M2 13l4.5 4.5"/><path d="M16.5 10.5L21 6"/></svg>
              <h1 className="text-lg font-semibold text-sidebar-foreground">Maple Leafs</h1>
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
