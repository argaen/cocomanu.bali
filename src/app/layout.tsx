import type { Metadata } from "next";
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
      <body>
        {children}
      </body>
    </html>
  );
}
