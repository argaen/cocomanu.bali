import React from 'react';
import { twMerge } from 'tailwind-merge';

export type SectionProps = {
  className?: string;
  header: string;
  headerClassName: string;
  content: React.JSX.Element;
};

export default function Section({
  className,
  header,
  headerClassName,
  content,
}: SectionProps) {
  return (
    <div id={header} className={twMerge('bg-rainy-day pb-14 md:pb-32 lg:pb-48 pt-26', className)}>
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
