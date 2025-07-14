import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { lato, montserrat, roboto_mono } from './fonts';

export const metadata: Metadata = {
  title: 'Maple Leafs Education',
  description: 'Your journey to Canadian education starts here.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className={cn(
        "font-body antialiased",
        lato.variable,
        montserrat.variable,
        roboto_mono.variable
      )}>
        <AuthProvider>
            {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
