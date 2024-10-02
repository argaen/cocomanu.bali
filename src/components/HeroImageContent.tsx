import Image from 'next/image';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export type HeroImageContentProps = {
  image: string;
  header: string;
  headerClassName: string;
  contentClassName: string;
  imageClassName?: string;
  title: string;
  text: string;
  href: string;
};

export default function HeroImageContent({
  header,
  headerClassName,
  image,
  contentClassName,
  imageClassName,
  title,
  text,
  href,
}: HeroImageContentProps) {
  return (
    <div className="grid sm:grid-cols-2">
      <div className={twMerge('relative w-full h-[550px] lg:h-[700px]', imageClassName)}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className={twMerge('flex justify-center items-center text-rainy-day p-6', contentClassName)}>
        <div className="flex flex-col gap-20 xl:w-6/7">
          <h1
            className={twMerge('hidden relative pt-6 text-center sm:block intersect:animate-fade-down intersect-once animate-delay-[250ms]', headerClassName)}
          >
            {header}
          </h1>
          <div className="flex flex-col gap-6 sm:h-1/2 justify-center sm:px-6 md:px-14 lg:px-28 intersect:animate-fade-up intersect-once animate-delay-[250ms]">
            <h2
              className="text-moss-green-300 pb-4"
            >
              {title}
            </h2>
            <p className="leading-relaxed text-justify">
              {text}
            </p>
            <div className="flex justify-end">
              <Link
                href={href}
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
  );
}
