import React from 'react';
import { twMerge } from 'tailwind-merge';

export type SectionProps = {
  className?: string;
  header: string;
  headerClassName: string;
  content: React.JSX.Element;
  /** Override the URL hash. Defaults to a slug of `header` (e.g. Pricing → `#pricing`). */
  id?: string;
};

function sectionIdFromHeader(header: string): string {
  return header
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function Section({
  className,
  header,
  headerClassName,
  content,
  id,
}: SectionProps) {
  return (
    <div
      id={id ?? sectionIdFromHeader(header)}
      className={twMerge('scroll-mt-24 bg-rainy-day pb-14 pt-26 md:scroll-mt-28 md:pb-32 lg:pb-48', className)}
    >
      <h1
        className={twMerge(
          'relative text-center -mt-30 md:-mt-32 lg:-mt-36 z-10 pb-6 md:pb-10 lg:pb-14',
          headerClassName,
        )}
      >
        {header}
      </h1>
      {content}
    </div>
  )
}
