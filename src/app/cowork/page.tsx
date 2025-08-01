import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';

import Introduction from '@/components/Introduction';
import Section from '@/components/Section';
import {
  Starlink,
  Chairs,
  AC,
  PhoneBooth,
  MeetingRoom,
  Chillout,
  Coffee,
  Community,
  CoworkIllustration,
  SolarPower,
  Rooftop,
} from '@/components/svg';
import Gallery from '@/components/Gallery';
import PricingCard from '@/components/PricingCard';

import HeroImage from '@/assets/images/cowork.png';
import ColiveImage from '@/assets/images/colive.png';

export const metadata: Metadata = {
  title: "Cocomanu - Coworking",
  description: "Our Coworking space",
  keywords: ['Coworking', 'Sumbul', 'Medewi'],
  robots: {
    index: false,
  },
};

export default function Cowork() {
  return (
    <div>
      <div id="hero" className="relative">
        <Image
          alt="Our Coworking space"
          src={HeroImage}
          quality={90}
          fill
          className="-z-10 object-cover"
          placeholder="blur"
          priority
          unoptimized
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 75vw, (max-width: 1280px) 90vw, 100vw"
        />
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
        className="bg-black-sand"
        header="Your Oficce"
        headerClassName="text-dusk-glow-200 pb-14"
        content={
          <div>
            <Gallery
              arrowClassName="fill-dusk-glow-200 disabled:fill-dusk-glow-300"
              selectorClassName="bg-dusk-glow-200"
              images={[
                {
                  src: HeroImage,
                  alt: 'Office',
                  caption: 'Amazing office',
                },
                {
                  src: ColiveImage,
                  alt: 'Home',
                  caption: 'lololol',
                },
                {
                  src: HeroImage,
                  alt: 'Office1',
                  caption: 'Lorem ipsum lololol',
                },
                {
                  src: ColiveImage,
                  alt: 'Home1',
                  caption: 'Lorem ipsum lalala',
                },
              ]}
            />
          </div>
        }
      />

      <Section
        header="Facilities"
        headerClassName="text-dusk-glow-200"
        content={(
          <div className="grid grid-cols-2 md:grid-cols-5 px-10 md:px-20 py-20 lg:px-40 gap-12 text-dusk-glow-100">
            <div className="facility intersect:animate-fade-up intersect-once">
              <Starlink className="size-24 lg:size-32 fill-black-sand" />
              Starlink Wifi
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-[100ms]">
              <SolarPower className="size-24 lg:size-32 fill-black-sand" />
              Solar Power
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-[100ms]">
              <Chairs className="size-24 lg:size-32 fill-black-sand" />
              Chairs
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-[200ms]">
              <AC className="size-24 lg:size-32 fill-black-sand" />
              Indoor AC
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-[300ms]">
              <PhoneBooth className="size-24 lg:size-32 fill-black-sand" />
              Phone Booths
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-[400ms]">
              <MeetingRoom className="size-24 lg:size-32 fill-black-sand" />
              Meeting Room
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-[500ms]">
              <Chillout className="size-24 lg:size-32 fill-black-sand" />
              Chillout Area
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-[500ms]">
              <Rooftop className="size-24 lg:size-32 fill-black-sand" />
              Rooftop
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-[600ms]">
              <Coffee className="size-24 lg:size-32 fill-black-sand" />
              Outdoor Cafe
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-[700ms]">
              <Community className="size-24 lg:size-32 fill-black-sand" />
              Community Events
            </div>
          </div>
        )}
      />

      <Section
        header="Pricing"
        className="bg-black-sand"
        headerClassName="pb-14 text-moss-green-200"
        content={
          <div className="flex flex-col md:flex-row md:items-start justify-center px-6 gap-y-12 gap-6 lg:gap-16">
            <PricingCard
              title="Day Pass"
              perks={[
                '1 free drink at the coffee bar',
                'Full access to shared facilities',
                'Unlimited phone booth usage',
              ]}
              price={
                <>
                  150K/
                  <span className="text-base">
                   day
                  </span>
                </>
              }
            />

            <PricingCard
              title="7-Day Pass"
              perks={[
                '3 free drinks at the coffee bar',
                'Full access to shared facilities',
                'Unlimited phone booth usage',
                'Members-only Whatsapp group',
                '10-page printing credits',
              ]}
              price={
                <>
                  700K/
                  <span className="text-base">
                   week
                  </span>
                  <span className="text-base text-gray-400">
                    {' '}
                    (100k/day)
                  </span>
                </>
              }
            />

            <PricingCard
              title="30-Day Pass"
              perks={[
                '10 free drinks at the coffee bar',
                'Full access to shared facilities',
                'Unlimited phone booth usage',
                'Members-only Whatsapp group',
                '30-page printing credits',
                '4-hour group meeting room credits',
                'Dedicated reserved desk',
                'Free business address',
              ]}
              price={
                <>
                  2.4M/
                  <span className="text-base">
                   month
                  </span>
                  <span className="text-base text-gray-400">
                    {' '}
                    (80k/day)
                  </span>
                </>
              }
            />
          </div>
        }
      />

      <div className="relative w-full h-[550px] lg:h-[700px]">
        <Image
          alt="Check our Coliving space"
          src={ColiveImage}
          quality={10}
          loading="lazy"
          placeholder="blur"
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
    </div>
  );
}
