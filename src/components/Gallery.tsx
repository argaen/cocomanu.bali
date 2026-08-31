'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Fade from 'embla-carousel-fade';

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

const DESKTOP_GALLERY_MQ = '(min-width: 768px)';

function useDesktopGalleryFade() {
  const [useFade, setUseFade] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_GALLERY_MQ);
    const update = () => setUseFade(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return useFade;
}

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
  const useFade = useDesktopGalleryFade();
  const plugins = useMemo(() => (useFade ? [Fade()] : []), [useFade]);

  return (
    <div className="flex flex-col items-center justify-center text-white-water">
      <Carousel
        key={useFade ? 'gallery-fade' : 'gallery-slide'}
        className="w-8/12 max-w-3xl md:w-3/5"
        plugins={plugins}
        opts={useFade ? { containScroll: false } : undefined}
      >
        <CarouselContent
          className={
            useFade
              ? 'ml-0'
              : 'ml-0 touch-pan-y [backface-visibility:hidden] [transform:translateZ(0)]'
          }
        >
          {images.map((img, i) => (
            <CarouselItem
              key={`${img.src}-${i}`}
              className={
                useFade
                  ? 'min-w-0 shrink-0 grow-0 basis-full pl-0'
                  : 'basis-full pl-0 [backface-visibility:hidden] [transform:translateZ(0)]'
              }
            >
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md bg-black-sand/40">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  draggable={false}
                  quality={IMAGE_QUALITY_SECTION}
                  sizes={IMAGE_SIZES_GALLERY}
                  priority={i === 0}
                  loading="eager"
                  className="pointer-events-none object-cover select-none"
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
