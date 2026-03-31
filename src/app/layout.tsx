import Script from 'next/script';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from 'next';

import '@/app/globals.css';
import { CartProvider } from '@/context/CartContext';
import Footer from '@/components/Footer';
import TopNav from '@/components/TopNav';

export const metadata: Metadata = {
  title: "Cocomanu",
  description: "Where work & life flow",
  metadataBase: new URL('https://www.cocomanu.com'),
  keywords: ['Coworking', 'Coliving', 'Sumbul', 'Medewi'],
  openGraph: {
    title: 'Cocomanu',
    description: 'Where work & life flow',
    type: 'website',
    url: 'https://www.cocomanu.com',
    siteName: 'Cocomanu',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Cocomanu logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cocomanu',
    description: 'Where work & life flow',
    images: ['/twitter-image'],
  },
  robots: {
    index: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preload" href="/fonts/Lot-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Josefin-Sans.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Yeserva-One.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <Script src="https://unpkg.com/tailwindcss-intersect@2.x.x/dist/observer.min.js" />
      <body className="flex flex-col h-screen antialiased">
        <CartProvider>
          <TopNav />
          <div className="mb-auto">
            {children}
          </div>
          <div className="">
            <Footer />
          </div>
        </CartProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
