
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { archivoBlack, inter } from './fonts';
import { ApplicationProvider } from '@/context/application-context';

export const metadata: Metadata = {
  title: 'Maple Leafs Education',
  description: 'Canada, without the guesswork. AI speed + RCIC accuracy to pick your college, build your file, and apply with confidence.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className={cn(
        "antialiased",
        inter.variable,
        archivoBlack.variable
      )}>
        <AuthProvider>
          <ApplicationProvider>
              {children}
          </ApplicationProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
