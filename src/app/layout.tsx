import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cocomanu",
  description: "Where work & life flow",
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
        <Script src="https://unpkg.com/tailwindcss-intersect@2.x.x/dist/observer.min.js" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
