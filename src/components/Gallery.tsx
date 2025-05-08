'use client';

import React from 'react';
import Image from 'next/image';

import { ArrowLeft, ArrowRight } from '@/components/svg';
import {twMerge} from 'tailwind-merge';
import type { StaticImageData } from 'next/image';

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
  selectorClassName,
}: GalleryProps) {
  const [index, setIndex] = React.useState(0);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-center w-full overflow-x-clip">
        <div className="flex absolute items-enter justify-between w-screen md:w-[520px] px-2 z-10">
          <button
            className={twMerge('py-3 bg-white-water rounded-xl', arrowClassName)}
            disabled={index === 0}
            onClick={() => {
              setIndex(index - 1);
            }}
          >
            <ArrowLeft className="size-10"/>
          </button>
          <button
            className={twMerge('py-3 bg-white-water rounded-xl', arrowClassName)}
            disabled={index === images.length - 1}
            onClick={() => {
              setIndex(index + 1);
            }}
          >
            <ArrowRight className="size-10"/>
          </button>
        </div>
        <div
          className={`flex items-center transition ease-out duration-500 gap-x-32`}
          style={{
            transform: `translateX(${-index * 512}px)`
          }}
        >
          {
            images.map((image, i) => (
              <div
                key={i}
                className={`relative flex-shrink-0 w-full h-[550px] transition ease-out duration-500 ${i === index ? 'scale-125' : 'scale-1'}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  quality={60}
                  fill
                  loading="lazy"
                  unoptimized
                  placeholder="blur"
                  className="object-cover"
                />
              </div>
            ))
          }
        </div>
      </div>
      <div className="flex pt-20 gap-x-2">
        {
          images.map((image, i) => (
            <button
              key={image.alt}
              className={`p-2 rounded-xl transition-all duration-500 ${i === index ? `${selectorClassName} px-4` : 'bg-white-water'}`}
              onClick={() => {
                setIndex(i);
              }}
            />
          ))
        }
      </div>
    </div>
  );
}
