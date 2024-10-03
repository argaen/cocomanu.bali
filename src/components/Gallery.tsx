'use client';

import React from 'react';
import Image from 'next/image';

import { ArrowLeft, ArrowRight } from '@/components/svg';

export type GalleryProps = {
  images: {
    src: string;
    alt: string;
    caption: string;
  }[];
}

export default function Gallery({
  images,
}: GalleryProps) {
  const [index, setIndex] = React.useState(0);

  return (
    <div className="flex items-center justify-center overflow-x-clip">
      <div className="flex absolute items-enter justify-between w-screen md:w-[520px] px-2 z-10">
        <button
          className="py-3 bg-white-water rounded-xl fill-dusk-glow-200 disabled:fill-dusk-glow-300"
          disabled={index === 0}
          onClick={() => {
            setIndex(index - 1);
          }}
        >
          <ArrowLeft className="size-10"/>
        </button>
        <button
          className="py-3 bg-white-water rounded-xl fill-dusk-glow-200 disabled:fill-dusk-glow-300"
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
                fill
                className="object-cover"
              />
            </div>
          ))
        }
      </div>
    </div>
  );
}
