import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

import type { StaticImageData } from 'next/image';
import {ArrowRightIcon} from '@heroicons/react/24/outline';
import Link from 'next/link';

export type HeroImageContentProps = {
  image: StaticImageData;
  header: string;
  headerClassName: string;
  header2ClassName: string;
  contentClassName: string;
  imageClassName?: string;
  imageInnerClassName?: string;
  linkClassName?: string;
  title: string;
  text: string;
  href: string;
  linkText?: string;
  linkDisabled?: boolean;
};

export default function HeroImageContent({
  header,
  headerClassName,
  header2ClassName,
  image,
  contentClassName,
  imageClassName,
  imageInnerClassName,
  linkClassName,
  title,
  text,
  href,
  linkText = 'Explore',
  linkDisabled = false,
}: HeroImageContentProps) {
  return (
    <div className="grid sm:grid-cols-2">
      <div className={twMerge('relative w-full h-[550px] lg:h-[700px] overflow-hidden', imageClassName)}>
        <Image
          src={image}
          alt={title}
          quality={90}
          fill
          loading="lazy"
          placeholder="blur"
          unoptimized
          className={twMerge('object-cover transition-all duration-300', imageInnerClassName)}
        />
      </div>
      <div className={twMerge('flex justify-center items-center p-6', contentClassName)}>
        <div className="flex flex-col gap-20 xl:w-6/7 intersect:animate-fade-up intersect-once animate-delay-300">
          <h1
            className={twMerge('hidden relative pt-6 text-center sm:block', headerClassName)}
          >
            {header}
          </h1>
          <div className="flex flex-col gap-6 sm:h-1/2 justify-center sm:px-6 md:px-14 lg:px-28">
            <h2
              className={twMerge('pb-4', header2ClassName)}
            >
              {title}
            </h2>
            <p className="leading-relaxed text-justify">
              {text}
            </p>
            <div className="flex justify-end">
              {linkDisabled ? (
                <span
                  className={twMerge(
                    'cta opacity-60 cursor-not-allowed transition-none hover:before:w-0 before:transition-none before:w-0',
                    linkClassName,
                  )}
                  aria-disabled="true"
                >
                  <span className="flex items-center py-1 px-2 z-10">
                    {linkText}
                  </span>
                </span>
              ) : (
                <Link
                  href={href}
                  className={twMerge(
                    'cta',
                    linkClassName,
                  )}
                >
                  <span className="flex items-center py-1 px-2 z-10">
                    {linkText}
                    <ArrowRightIcon className="size-4 ml-1 font-bold"/>
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
