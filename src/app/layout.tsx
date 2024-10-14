import Script from 'next/script';
import type { Metadata } from 'next';

import './globals.css';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "Cocomanu",
  description: "Where work & life flow",
  keywords: ['Coworking', 'Coliving', 'Sumbul', 'Medewi'],
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
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/Lot-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Josefin-Sans.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Yeserva-One.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <Script src="https://unpkg.com/tailwindcss-intersect@2.x.x/dist/observer.min.js" />
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
