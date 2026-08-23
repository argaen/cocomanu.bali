import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';

import Introduction from '@/components/Introduction';
import Section from '@/components/Section';
import {
  Chairs,
  AC,
  PhoneBooth,
  MeetingRoom,
  Chillout,
  Coffee,
  Community,
  CoworkIllustration,
  Rooftop,
} from '@/components/svg';
import Gallery from '@/components/Gallery';
import PricingCard from '@/components/PricingCard';
import PricingTierPrice from '@/components/PricingTierPrice';
import CoworkBookingForm from '@/components/CoworkBookingForm';
import { getCoworkingPricing } from '@/lib/notion';
import { listLocalSiteImages, resolveLocalSiteImage } from '@/lib/site-images';

export const metadata: Metadata = {
  title: "Cocomanu - Coworking",
  description: "Our Coworking space",
  keywords: ['Coworking', 'Sumbul', 'Medewi'],
  robots: {
    index: false,
  },
};

function isDailyEntry(name: string): boolean {
  const normalized = name.trim().toLowerCase();
  return normalized === 'daily' || normalized === 'daily pass' || normalized === 'day pass';
}

export default async function Cowork() {
  const pricing = await getCoworkingPricing();
  const heroSrc = resolveLocalSiteImage('cowork_1');
  const coliveImage = resolveLocalSiteImage('colive_1');
  const officeGalleryImages = listLocalSiteImages('cowork_')
    .filter((img) => img.slug !== 'cowork_1')
    .map((img) => ({
      src: img.src,
      alt: img.slug.replace(/_/g, ' '),
      caption: '',
    }));

  return (
    <div>
      <div id="hero" className="relative">
        {heroSrc ? (
          <Image
            alt="Our Coworking space"
            src={heroSrc}
            quality={90}
            fill
            className="-z-10 object-cover"
            priority
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 75vw, (max-width: 1280px) 90vw, 100vw"
          />
        ) : null}
        <main className="flex h-screen items-center justify-center">
          <h1 className="text-dusk-glow-200 animate-fade-up animate-duration-500 animate-delay-1000">Cowork</h1>
        </main>
      </div>

      <Introduction
        title="Working at Cocomanu"
        titleClassName="text-dusk-glow-200"
        image={
          <CoworkIllustration className="fill-dusk-glow-100 "/>
        }
        content={(
          <div className="space-y-4">
            <p>
              Let&apos;s talk about the realities of remote work. As digital nomads who&apos;
              traveled the globe, we&apos;ve dealt with it all: unreliable internet, cramped workspaces,
              no quiet spots for calls - and the ultimate productivity killer, watching others have
              fun while you&apos;re stuck working.
            </p>
            <p>
              We&apos;ve made it our mission to eliminate these hassless so you can focus on what matters
              the most.
            </p>
          </div>
        )}
      />

      <Section
        header="Your Office"
        className="bg-black-sand"
        headerClassName="text-dusk-glow-200"
        content={
          <Gallery
            arrowClassName="text-dusk-glow-200"
            selectorClassName="bg-dusk-glow-200"
            images={officeGalleryImages}
          />
        }
      />

      <Section
        header="Facilities"
        headerClassName="text-dusk-glow-200"
        content={(
          <div className="grid grid-cols-2 md:grid-cols-4 px-10 md:px-20 lg:px-40 gap-12 text-dusk-glow-100">
            <div className="facility intersect:animate-fade-up intersect-once">
              <Chairs className="size-24 lg:size-32 fill-black-sand" />
              Chairs
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-100">
              <AC className="size-24 lg:size-32 fill-black-sand" />
              Indoor AC
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-200">
              <PhoneBooth className="size-24 lg:size-32 fill-black-sand" />
              Phone Booths
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-300">
              <MeetingRoom className="size-24 lg:size-32 fill-black-sand" />
              Meeting Room
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-400">
              <Chillout className="size-24 lg:size-32 fill-black-sand" />
              Chillout Area
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-500">
              <Rooftop className="size-24 lg:size-32 fill-black-sand" />
              Rooftop
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-600">
              <Coffee className="size-24 lg:size-32 fill-black-sand" />
              Outdoor Cafe
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-700">
              <Community className="size-24 lg:size-32 fill-black-sand" />
              Community Events
            </div>
          </div>
        )}
      />

      <Section
        header="Pricing"
        className="bg-black-sand"
        headerClassName="text-moss-green-200"
        content={
          <>
            <div className="mx-auto grid max-w-6xl grid-cols-1 justify-items-center gap-y-12 gap-6 px-6 md:grid-cols-3 md:items-stretch md:gap-10 lg:gap-12">
              {pricing.length > 0 ? (
                pricing.map((item) => (
                  <PricingCard
                    key={item.id}
                    title={item.name}
                    perks={item.includes}
                    price={(
                      <PricingTierPrice
                        price={item.price}
                        discount={item.discount}
                        periodRate={!isDailyEntry(item.name) && item.dailyPrice > 0 ? item.dailyPrice : undefined}
                        periodLabel="/day"
                      />
                    )}
                  />
                ))
              ) : (
                <p className="text-center text-white-water/80">Pricing details are coming soon.</p>
              )}
            </div>
            {pricing.length > 0 ? (
              <CoworkBookingForm pricing={pricing} />
            ) : null}
          </>
        }
      />

      {coliveImage ? (
        <div className="relative w-full h-[550px] lg:h-[700px]">
          <Image
            alt="Check our Coliving space"
            src={coliveImage}
            quality={10}
            loading="lazy"
            fill
            className="-z-10 object-cover contrast-[.25]"
          />
          <div className="flex flex-col h-full items-center justify-center gap-6">
            <h2>Want to stay with us too?</h2>
            <div className="flex justify-center">
              <Link
                href="/colive"
                className="cta bg-ocean-blue-200 before:bg-ocean-blue-100"
              >
                <span className="flex items-center py-1 px-2 z-10">
                  Coliving
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
