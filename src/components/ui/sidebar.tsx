
"use client";

import { useUser } from '@/hooks/use-user';
import { studentMenuItems, adminMenuItems } from '@/lib/menu-items';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function Sidebar({ collapsed = false }) {
  const { profile } = useUser();
  const pathname = usePathname();
  const menuItems = profile?.role === 'admin' ? adminMenuItems : studentMenuItems;

  return (
    <aside className={cn(
        "hidden lg:flex lg:flex-col lg:h-screen lg:p-4 lg:border-r lg:border-border transition-all duration-300",
        collapsed ? "lg:w-20" : "lg:w-64"
    )}>
      <div className="flex-1">
        <div className="p-4">
          <Link href="/">
            <img 
                src={collapsed ? "/logo.svg" : "/logo-full.png"} 
                alt="Maple Leafs Education" 
                className={cn("transition-all", collapsed ? "w-8 mx-auto" : "w-32")}
            />
          </Link>
        </div>
        <nav className="mt-8">
          <TooltipProvider delayDuration={0}>
            <ul>
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                        href={item.href}
                        className={cn(
                            'flex items-center p-3 my-1 rounded-lg transition-colors',
                            pathname === item.href
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent hover:text-accent-foreground',
                            collapsed && "justify-center"
                        )}
                        >
                        <item.icon className={cn("w-5 h-5", !collapsed && "mr-3")} />
                        <span className={cn(collapsed && "sr-only")}>{item.label}</span>
                        </Link>
                    </TooltipTrigger>
                    {collapsed && (
                        <TooltipContent side="right">
                            {item.label}
                        </TooltipContent>
                    )}
                  </Tooltip>
                </li>
              ))}
            </ul>
          </TooltipProvider>
        </nav>
      </div>
      <div className="p-4">
        <ThemeToggle />
      </div>
    </aside>
  );
}
