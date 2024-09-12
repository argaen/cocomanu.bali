import Image from 'next/image';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export type SectionProps = {
  bg: string;
  headerClassName: string;
  contentClassName: string;
  imageClassName?: string;
  header: string;
  title: string;
  text: string;
};

export default function Section({
  bg,
  header,
  headerClassName,
  contentClassName,
  imageClassName,
  title,
  text,
}: SectionProps) {
  return (
    <div className="bg-rainy-day">
      <h1
        className={twMerge('relative pt-6 text-center -mb-6 sm:hidden z-10', headerClassName)}
      >
        {header}
      </h1>
      <div className="grid sm:grid-cols-2">
        <div className={twMerge('relative w-full h-[500px] lg:h-[700px]', imageClassName)}>
          <Image
            src={bg}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div className={twMerge('flex justify-center items-center text-rainy-day p-6', contentClassName)}>
          <div className="flex flex-col gap-20 xl:w-4/5">
            <h1
              className={twMerge('hidden relative pt-6 text-center sm:block', headerClassName)}
            >
              {header}
            </h1>
            <div className="flex flex-col gap-6 sm:h-1/2 justify-center lg:px-28">
              <h2
                className="text-moss-green-300 pb-4"
              >
                {title}
              </h2>
              <p className="text-sm leading-relaxed text-justify sm:text-base">
                {text}
              </p>
              <div className="flex justify-end">
                <Link
                  href="#"
                  className={twMerge('flex items-center bg-dawn-rays-300 text-black-sand py-1 px-2 rounded-md')}
                >
                  Explore
                  <ArrowRightIcon className="size-4 ml-1 font-bold"/>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
