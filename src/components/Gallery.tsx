'use client';

import React from 'react';
import Image from 'next/image';

import type { StaticImageData } from 'next/image';

import {
  blurPlaceholderProps,
  IMAGE_QUALITY_SECTION,
  IMAGE_SIZES_GALLERY,
} from '@/lib/next-image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export type GalleryProps = {
  arrowClassName: string;
  selectorClassName: string;
  images: {
    src: StaticImageData | string;
    alt: string;
    caption: string;
  }[];
};

export default function Gallery({
  images,
  arrowClassName,
}: GalleryProps) {
  return (
    <div className="flex flex-col items-center justify-center text-white-water">
      <Carousel className="w-8/12 md:w-3/5">
        <CarouselContent className="ml-0">
          {images.map((img, i) => (
            <CarouselItem key={`${img.src}-${i}`} className="basis-full pl-0">
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md bg-black-sand/40">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  quality={IMAGE_QUALITY_SECTION}
                  sizes={IMAGE_SIZES_GALLERY}
                  priority={i === 0}
                  loading="eager"
                  className="object-cover"
                  {...blurPlaceholderProps(img.src)}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious iconClassName={arrowClassName} />
        <CarouselNext iconClassName={arrowClassName} />
      </Carousel>
    </div>
  );
}
