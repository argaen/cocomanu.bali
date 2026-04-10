import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';

import TopNav from '@/components/TopNav';
import Introduction from '@/components/Introduction';
import Section from '@/components/Section';
import Gallery from '@/components/Gallery';

import { GardenIllustration } from '@/components/svg';
import { GARDEN_IMAGE } from '@/lib/notion/constants';
import { getPlants } from '@/lib/notion';
import { PlantCollection } from '@/components/PlantCollection';

export const metadata: Metadata = {
  title: "Cocomanu - Tropical Garden",
  description: "Discover our tropical garden",
  keywords: ['garden', 'tropical', 'organic'],
  robots: {
    index: false,
  },
};

export default async function Garden() {
  const [plants, mapPlants] = await Promise.all([
    getPlants({ limit: 6 }),
    getPlants(),
  ]);

  return (
    <div>
      <div id="hero" className="relative">
        <Image
          alt="Garden"
          src={GARDEN_IMAGE}
          quality={90}
          fill
          className="-z-10 object-cover"
          placeholder="blur"
          priority
          unoptimized
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 75vw, (max-width: 1280px) 90vw, 100vw"
        />
        <div className="absolute w-screen top-0">
          <TopNav />
        </div>
        <main className="flex h-screen items-center justify-center">
          <h1 className="text-moss-green-200 animate-fade-up animate-duration-500 animate-delay-1000">Garden</h1>
        </main>
      </div>

      <Introduction
        title="Nature At Home"
        titleClassName="text-moss-green-200"
        image={
          <GardenIllustration className="fill-moss-green-100" />
        }
        content={(
          <div className="space-y-4">
            <p>
              Tucked right in front of the coliving space, our 2000sqm garden is more than just a green backdrop.
            </p>

            <p>
Designed using permaculture principles, the garden is a self-sustaining ecosystem that provides our cafe with seasonal herbs, greens, edible flowers and tropical fruits - all grown without chemicals and tended by hand.
            </p>
          </div>
        )}
      />

      <Section
        header="The Ecosystem"
        headerClassName="text-moss-green-200"
        className="bg-black-sand"
        content={
          <Gallery
            arrowClassName="fill-moss-green-200 disabled:fill-moss-green-300"
            selectorClassName="bg-moss-green-200"
            images={[
              {
                src: GARDEN_IMAGE,
                alt: 'Garden1',
                caption: 'Acerola',
              },
              {
                src: GARDEN_IMAGE,
                alt: 'Garden2',
                caption: 'Mango',
              },
              {
                src: GARDEN_IMAGE,
                alt: 'Garden2',
                caption: 'Mango',
              },
              {
                src: GARDEN_IMAGE,
                alt: 'Garden2',
                caption: 'Mango',
              },
            ]}
          />
        }
      />

      <Section
        header="Our Plants"
        headerClassName="text-moss-green-200"
        className="text-black-sand"
        content={
          <div>
            <div className="flex flex-col px-10 md:px-6 lg:px-12 justify-center items-center gap-6">
              <div className="md:w-4/6 lg:w-1/2 space-y-4">
                <p>
                  Each plant in our garden plays a role in the ecosystem we&apos;ve built. If you&apos;re the curious type, delve deeper into our library of the species we grow, how we use them and how they support each other.
                </p>
              </div>
              <div className="w-1/2 md:w-4/6 lg:w-1/2">
                <Suspense fallback={<div className="min-h-48 rounded-md bg-white-water/40" />}>
                  <PlantCollection
                    plants={plants}
                    useModal={false}
                    containerClassName="lg:grid-cols-2"
                  />
                </Suspense>
              </div>
              <Link
                href="/garden/plants"
                className="cta text-lg bg-moss-green-200 before:bg-moss-green-100"
              >
                <span className="flex items-center py-2 px-4 z-10 text-white-water">
                  Plant Pokedex
                  <ArrowRightIcon className="size-4 ml-1 font-bold"/>
                </span>
              </Link>
            </div>
          </div>
        }
      />
    </div>
  );
}
