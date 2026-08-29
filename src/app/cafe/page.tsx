import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';

import TopNav from '@/components/TopNav';
import Introduction from '@/components/Introduction';
import Section from '@/components/Section';
import Gallery from '@/components/Gallery';

import { CafeIllustration, LowWasteIllustration } from '@/components/svg';
import { resolveLocalSiteImage } from '@/lib/site-images';
import {
  IMAGE_QUALITY_DECORATIVE,
  IMAGE_SIZES_FULL_VIEWPORT,
} from '@/lib/next-image';

export const metadata: Metadata = {
  title: "Cocomanu - Cafe",
  description: "Try our meals",
  keywords: ['food', 'meals', 'break'],
  robots: {
    index: false,
  },
};

export default function Cafe() {
  const gardenImage = resolveLocalSiteImage('garden_1');

  return (
    <div>
      <div id="hero" className="relative">
        {gardenImage ? (
          <Image
            alt="Cafe"
            src={gardenImage}
            fill
            className="-z-10 object-cover"
            priority
            sizes={IMAGE_SIZES_FULL_VIEWPORT}
          />
        ) : null}
        <div className="absolute w-screen top-0">
          <TopNav />
        </div>
        <main className="flex h-screen items-center justify-center">
          <h1 className="text-dawn-rays-200 animate-fade-up animate-duration-500 animate-delay-1000">Garden</h1>
        </main>
      </div>

      <Introduction
        title="Food from the Garden"
        titleClassName="text-dawn-rays-200"
        image={
          <CafeIllustration className="fill-dawn-rays-100" />
        }
        content={(
          <div className="space-y-4">
            <p>
              Our cafe is open to all - coworking guests, coliving residents and anyone passing through Yeh Sumbul looking for something fresh and nourishing.
            </p>

          </div>
        )}
      />

      <Section
        header="A Low-Waste Cafe, by Design"
        headerClassName="text-dawn-rays-200 !text-4xl lg:!text-4xl !font-yeserva pb-14 px-14"
        content={
          <div className="flex flex-col px-10 md:px-6 lg:px-12 justify-center items-center text-black-sand gap-y-10 pb-14">
            <div className="md:w-4/6 lg:w-1/2 space-y-4">
              <p>
                We believe good food shouldn&apos;t come at the planet&apos;s expense. That&apos;s why the Cocomanu Cafe is designed to operate as part of a closed-loop system:
              </p>
            </div>
            <div className="relative aspect-square w-full md:w-[500px] lg:w-[600px] sm:flex items-center justify-center">
              <LowWasteIllustration className="fill-black-sand" />
            </div>
            <div className="md:w-4/6 lg:w-1/2 space-y-4">
              <p>
                It&apos;s not perfect - but we&apos;re always improving. Every meal you enjoy here helps keep this little ecosystem in balance.
              </p>
            </div>
          </div>
        }
      />

      <Section
        header="The Ecosystem"
        headerClassName="text-moss-green-200"
        className="bg-black-sand"
        content={
          <Gallery
            arrowClassName="fill-moss-green-200 disabled:fill-moss-green-300"
            selectorClassName="bg-moss-green-200"
            images={
              gardenImage
                ? [
                    {
                      src: gardenImage,
                      alt: 'Garden1',
                      caption: 'Acerola',
                    },
                    {
                      src: gardenImage,
                      alt: 'Garden2',
                      caption: 'Mango',
                    },
                    {
                      src: gardenImage,
                      alt: 'Garden2',
                      caption: 'Mango',
                    },
                    {
                      src: gardenImage,
                      alt: 'Garden2',
                      caption: 'Mango',
                    },
                  ]
                : []
            }
          />
        }
      />

      <Section
        header="Learn More"
        headerClassName="text-moss-green-200"
        className="bg-black-sand"
        content={
          <div>
            <div className="flex px-10 md:px-6 lg:px-12 justify-center items-center">
              <div className="md:w-4/6 lg:w-3/6 space-y-4">
                <p>
                  Each plant in our garden plays a role in the ecosystem we&apos;ve built. If you&apos;re the curious type, delve deeper into our library of the species we grow, how we use them and how they support each other.
                </p>
              </div>
            </div>
          </div>
        }
      />

      {gardenImage ? (
        <div className="relative w-full h-[550px] lg:h-[700px]">
          <Image
            alt="Try our meals"
            src={gardenImage}
            quality={IMAGE_QUALITY_DECORATIVE}
            loading="lazy"
            fill
            sizes={IMAGE_SIZES_FULL_VIEWPORT}
            className="-z-10 object-cover contrast-[.25]"
          />
          <div className="flex flex-col h-full items-center justify-center gap-6">
            <h2>Try our meals</h2>
            <div className="flex justify-center">
              <Link
                href="/cafe"
                className="cta bg-dawn-rays-200 before:bg-dawn-rays-100"
              >
                <span className="flex items-center py-1 px-2 z-10">
                  Garden
                  <ArrowRightIcon className="size-4 ml-1 font-bold"/>
                </span>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
