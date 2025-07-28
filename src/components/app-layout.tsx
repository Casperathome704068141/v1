
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
import { GraduationCap, LayoutDashboard, Search, Settings, FileText, Calendar, LifeBuoy, LogOut, CreditCard, User } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { ApplicationProvider } from '@/context/application-context';
import Image from 'next/image';
import { ThemeToggle } from './ui/theme-toggle';

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
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/billing">
             <CreditCard className="mr-2 h-4 w-4" />
             Billing
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
           <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
           </Link>
        </DropdownMenuItem>
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
  { href: '/billing', icon: CreditCard, label: 'Billing & Plan' },
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
                <Image src="/logo.svg" alt="MLE Logo" width={40} height={40} className="text-sidebar-foreground"/>
                <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
                    <h1 className="text-lg font-bold text-sidebar-foreground leading-tight">MLE</h1>
                    <span className="text-xs text-sidebar-foreground/80 leading-tight">Maple Leafs Education</span>
                </div>
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
              <div className="px-4 py-2 text-xs text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
                <p>A BENO 1017 PRODUCT. ALL RIGHTS RESERVED</p>
              </div>
            </SidebarFooter>
          </Sidebar>
          <ApplicationProvider>
            <SidebarInset>
              <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:justify-end">
                 <SidebarTrigger className="p-3 text-2xl hover:bg-gray-100 rounded-lg sm:hidden" />
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <UserMenu />
                </div>
              </header>
              {children}
            </SidebarInset>
          </ApplicationProvider>
        </div>
      </SidebarProvider>
  );
}
