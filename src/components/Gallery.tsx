'use client';

import React from 'react';
import Image from 'next/image';

import type { StaticImageData } from 'next/image';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export type GalleryProps = {
  arrowClassName: string;
  selectorClassName: string;
  images: {
    src: StaticImageData;
    alt: string;
    caption: string;
  }[];
}

export default function Gallery({
  images,
  arrowClassName,
}: GalleryProps) {

  return (
    <div className="flex flex-col items-center justify-center text-white-water">
       <Carousel className="w-8/12 md:w-3/5">
        <CarouselContent>
          {images.map((img, i) => (
            <CarouselItem key={i} className="rounded-md">
              <Image
                src={img.src}
                alt={img.alt}
                width={1200}
                height={800}
                className="block w-full h-auto rounded-md object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious iconClassName={arrowClassName} />
        <CarouselNext iconClassName={arrowClassName} />
      </Carousel>
    </div>
  );
}
