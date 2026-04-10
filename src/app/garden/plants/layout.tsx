import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: 'Plants | %s',
    default: 'Plants',
  },
  description: "Our plants in the Cocomanu garden",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="w-full">{children}</div>;
}
