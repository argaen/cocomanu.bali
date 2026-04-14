import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';

import Introduction from '@/components/Introduction';
import Section from '@/components/Section';
import {
  Coworking,
  Ensuite,
  Garden,
  Kitchen,
  Pool,
  Projector,
  ColiveIllustration,
  Patio,
  SurfRack
} from '@/components/svg';
import Gallery from '@/components/Gallery';
import PricingCard from '@/components/PricingCard';
import ColiveBookingForm from '@/components/ColiveBookingForm';
import { formatPriceNumberAsK, getColivePricing } from '@/lib/notion';

import HeroImage from '@/assets/images/colive.png';
import { GARDEN_IMAGE } from '@/lib/notion/constants';

export const metadata: Metadata = {
  title: "Cocomanu - Coliving",
  description: "Our Coliving space",
  keywords: ['Coliving', 'Sumbul', 'Medewi'],
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

function isNightlyEntry(name: string): boolean {
  const normalized = name.trim().toLowerCase();
  return (
    normalized === '1 night'
    || normalized === 'night'
    || normalized === 'nightly'
    || normalized === 'nightly pass'
    || normalized === 'night pass'
  );
}

export default async function Colive() {
  const pricing = await getColivePricing();

  return (
    <div>
      <div id="hero" className="relative">
        <Image
          alt="Our Coliving space"
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
          <h1 className="text-ocean-blue-200 animate-fade-up animate-duration-500 animate-delay-1000">Colive</h1>
        </main>
      </div>

      <Introduction
        title="Living at Cocomanu"
        titleClassName="text-ocean-blue-200"
        image={
          <ColiveIllustration className="fill-ocean-blue-100"/>
        }
        content={(
          <div>
            <p className="mb-4">
              Finding a home on the road as a digital nomad isn&apos;t easy. You want to connect with others but party hostels aren&apos;t your vibe. You crave routine, comfort and privacy, but staying alone in an Airbnb can feel isolating.
            </p>
            <p>
              That&apos;s why we created our coliving space with long-term stay in mind. With a full kitchen and living room, a refreshing pool and a lush edible garden, it&apos;s easy to find balance and community - all just steps away from our coworking space.
              the most.
            </p>
          </div>
        )}
      />

      <Section
        header="The House"
        headerClassName="text-ocean-blue-200"
        className="bg-black-sand"
        content={
          <Gallery
            arrowClassName="text-ocean-blue-200"
            selectorClassName="bg-ocean-blue-200"
            images={[
              {
                src: HeroImage,
                alt: 'Office',
                caption: 'Amazing office',
              },
              {
                src: HeroImage,
                alt: 'Home',
                caption: 'lololol',
              },
              {
                src: HeroImage,
                alt: 'Office1',
                caption: 'Lorem ipsum lololol',
              },
              {
                src: HeroImage,
                alt: 'Home1',
                caption: 'Lorem ipsum lalala',
              },
            ]}
          />
        }
      />

      <div className="flex items-center justify-center text-black-sand p-20 md:px-[100px] lg:px-[300px] xl:px-[500px]">
        <p>
          Each private room features a queen-sized bed, ensuite bathrooms and a desk so you have the option to work in peace whenever you need your own space.
        </p>
      </div>

      <Section
        header="Your Room"
        headerClassName="text-ocean-blue-200"
        className="bg-black-sand"
        content={
          <Gallery
            arrowClassName="text-ocean-blue-200"
            selectorClassName="bg-ocean-blue-200"
            images={[
              {
                src: HeroImage,
                alt: 'Office2',
                caption: 'Amazing office',
              },
              {
                src: HeroImage,
                alt: 'Home2',
                caption: 'lololol',
              },
              {
                src: HeroImage,
                alt: 'Office3',
                caption: 'Lorem ipsum lololol',
              },
              {
                src: HeroImage,
                alt: 'Home3',
                caption: 'Lorem ipsum lalala',
              },
            ]}
          />
        }
      />

      <Section
        header="Facilities"
        headerClassName="text-ocean-blue-200"
        content={(
          <div className="grid grid-cols-2 md:grid-cols-4 px-10 md:px-20 lg:px-40 gap-12 text-ocean-blue-100">
            <div className="facility intersect:animate-fade-up intersect-once">
              <Coworking className="size-24 lg:size-32 fill-black-sand" />
              Coworking Access
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-100">
              <Ensuite className="size-24 lg:size-32 fill-black-sand" />
              Private ensuites
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-300">
              <Patio className="size-24 lg:size-32 fill-black-sand" />
              Private Patio
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-300">
              <SurfRack className="size-24 lg:size-32 fill-black-sand" />
              Private Surf Racks
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-200">
              <Kitchen className="size-24 lg:size-32 fill-black-sand" />
              Full Shared Kitchen
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-400">
              <Projector className="size-24 lg:size-32 fill-black-sand" />
              Movie Projector
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-600">
              <Pool className="size-24 lg:size-32 fill-black-sand" />
              Swimming Pool
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-700">
              <Garden className="size-24 lg:size-32 fill-black-sand" />
              Community Garden
            </div>
          </div>
        )}
      />

      <Section
        header="Pricing"
        headerClassName="text-moss-green-200"
        className="bg-black-sand"
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
                      <>
                        <span className="text-base font-semibold">IDR</span>
                        {' '}
                        {formatCompactPrice(item.price)}
                        {!isNightlyEntry(item.name) && item.dailyPrice > 0 ? (
                          <span className="text-base text-gray-400">
                            {' '}
                            ({formatPriceNumberAsK(item.dailyPrice)}/night)
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
            {pricing.length > 0 ? (
              <ColiveBookingForm pricing={pricing} />
            ) : null}
          </>
        }
      />

      <div className="relative w-full h-[550px] lg:h-[700px]">
        <Image
          alt="Check our Garden"
          src={GARDEN_IMAGE}
          quality={10}
          loading="lazy"
          placeholder="blur"
          fill
          className="-z-10 object-cover contrast-[.25]"
        />
        <div className="flex flex-col h-full items-center justify-center gap-6">
          <h2>A place to relax and disconnect</h2>
          <div className="flex justify-center">
            <Link
              href="/garden"
              className="cta bg-moss-green-200 before:bg-moss-green-100"
            >
              <span className="flex items-center py-1 px-2 z-10">
                Garden
                <ArrowRightIcon className="size-4 ml-1 font-bold"/>
              </span>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
