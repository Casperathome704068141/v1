
import type {Metadata} from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/auth-context';
import { LocaleProvider } from '@/context/locale-context';
import { NotificationsProvider } from '@/context/notifications-context';
import { cn } from '@/lib/utils';
import { inter, interTight, spaceGrotesk } from './fonts';

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
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        {/* Analytics Snippets */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <Script
          id="mixpanel-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_queue".split(" ");for(h=0;h<i.length;h++)g(a,i[h]);b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}}(document,window.mixpanel||[]));
              mixpanel.init('${process.env.NEXT_PUBLIC_MIXPANEL_TOKEN}', {debug: true, track_pageview: true});
            `,
          }}
        />
      </head>
      <body className={cn(
        "font-sans antialiased",
        inter.variable,
        interTight.variable,
        spaceGrotesk.variable,
      )}>
        <AuthProvider>
          <LocaleProvider>
            <NotificationsProvider>
              {children}
            </NotificationsProvider>
          </LocaleProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
