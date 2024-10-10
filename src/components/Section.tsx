import { twMerge } from 'tailwind-merge';

export type SectionProps = {
  className?: string;
  header: string;
  headerClassName: string;
  content: JSX.Element;
};

export default function Section({
  className,
  header,
  headerClassName,
  content,
}: SectionProps) {
  return (
    <div id={header} className={twMerge('bg-rainy-day pb-6', className)}>
      <h1
        className={twMerge(
          'relative text-center -mb-6 pt-10 z-10',
          headerClassName,
        )}
      >
        {header}
      </h1>
      {content}
    </div>
  )
}
