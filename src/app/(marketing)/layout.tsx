import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/marketing/site-header';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-card py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Maple Leafs Education
      </footer>
    </div>
  );
}

