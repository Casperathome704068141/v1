'use client';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/context/notifications-context';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function NotificationsBell() {
  const { notifications, markAsRead } = useNotifications();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
              {unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-auto">
        {notifications.length === 0 && (
          <div className="p-4 text-sm text-muted-foreground">No notifications</div>
        )}
        {notifications.map(n => (
          <DropdownMenuItem key={n.id} className="whitespace-normal" onSelect={() => markAsRead(n.id)} asChild>
            {n.link ? (
              <Link href={n.link} className={n.read ? '' : 'font-medium'}>
                {n.message}
              </Link>
            ) : (
              <span className={n.read ? '' : 'font-medium'}>{n.message}</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
