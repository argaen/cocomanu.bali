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
import { formatPriceNumberAsK, getCoworkingPricing } from '@/lib/notion';

import HeroImage from '@/assets/images/cowork-1.png';
import ColiveImage from '@/assets/images/colive.png';

export const metadata: Metadata = {
  title: "Cocomanu - Coworking",
  description: "Our Coworking space",
  keywords: ['Coworking', 'Sumbul', 'Medewi'],
  robots: {
    index: false,
  },
};

function formatCompactPrice(value: number): string {
  const amount = Math.max(0, Math.round(value));
  if (!Number.isFinite(amount)) return '0';
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    const body = Number(millions.toFixed(1)).toString().replace(/\.0$/, '');
    return `${body}M`;
  }
  return formatPriceNumberAsK(amount);
}

function isDailyEntry(name: string): boolean {
  const normalized = name.trim().toLowerCase();
  return normalized === 'daily' || normalized === 'daily pass' || normalized === 'day pass';
}

export default async function Cowork() {
  const pricing = await getCoworkingPricing();

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
        header="Your Office"
        className="bg-black-sand"
        headerClassName="text-dusk-glow-200"
        content={
          <Gallery
            arrowClassName="text-dusk-glow-200"
            selectorClassName="bg-dusk-glow-200"
            images={[
              {
                src: HeroImage,
                alt: 'Office',
                caption: 'Amazing office',
              },
              {
                src: HeroImage,
                alt: 'Office1',
                caption: 'Lorem ipsum lololol',
              },
              {
                src: HeroImage,
                alt: 'Office2',
                caption: 'Lorem ipsum lalala',
              },
              {
                src: HeroImage,
                alt: 'Office3',
                caption: 'Lorem ipsum lalala',
              },
            ]}
          />
        }
      />

      <Section
        header="Facilities"
        headerClassName="text-dusk-glow-200"
        content={(
          <div className="grid grid-cols-2 md:grid-cols-5 px-10 md:px-20 lg:px-40 gap-12 text-dusk-glow-100">
            <div className="facility intersect:animate-fade-up intersect-once">
              <Starlink className="size-24 lg:size-32 fill-black-sand" />
              Starlink Wifi
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-100">
              <SolarPower className="size-24 lg:size-32 fill-black-sand" />
              Solar Power
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-200">
              <Chairs className="size-24 lg:size-32 fill-black-sand" />
              Chairs
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-300">
              <AC className="size-24 lg:size-32 fill-black-sand" />
              Indoor AC
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-400">
              <PhoneBooth className="size-24 lg:size-32 fill-black-sand" />
              Phone Booths
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-500">
              <MeetingRoom className="size-24 lg:size-32 fill-black-sand" />
              Meeting Room
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-600">
              <Chillout className="size-24 lg:size-32 fill-black-sand" />
              Chillout Area
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-700">
              <Rooftop className="size-24 lg:size-32 fill-black-sand" />
              Rooftop
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-800">
              <Coffee className="size-24 lg:size-32 fill-black-sand" />
              Outdoor Cafe
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-900">
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
          <div className="mx-auto grid max-w-6xl grid-cols-1 justify-items-center gap-y-12 gap-6 px-6 md:grid-cols-3 md:items-stretch md:gap-10 lg:gap-12">
            {pricing.length > 0 ? (
              pricing.map((item) => (
                <PricingCard
                  key={item.id}
                  title={item.name}
                  perks={item.includes}
                  price={(
                    <>
                      <span className="text-base font-semibold">IDR</span>
                      {' '}
                      {formatCompactPrice(item.price)}
                      {!isDailyEntry(item.name) && item.dailyPrice > 0 ? (
                        <span className="text-base text-gray-400">
                          {' '}
                          ({formatPriceNumberAsK(item.dailyPrice)}/day)
                        </span>
                      ) : null}
                    </>
                  )}
                />
              ))
            ) : (
              <p className="text-center text-white-water/80">Pricing details are coming soon.</p>
            )}
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
