import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: 'Blog | %s',
    default: 'Blog',
  },
  description: "Read about how our coworking and coliving space came to be",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex justify-center w-full">
      <div className="w-3/4 md:w-3/5 lg:w-1/2 pt-20">
        {children}
      </div>
    </div>
  );
}
