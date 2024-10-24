import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';

import TopNav from '@/components/TopNav';
import Introduction from '@/components/Introduction';
import Section from '@/components/Section';
import {
  Bar,
  Couch,
  Coworking,
  Ensuite,
  Garden,
  Kitchen,
  Pool,
  Projector,
  ColiveIllustration
} from '@/components/svg';
import Gallery from '@/components/Gallery';
import PricingCard from '@/components/PricingCard';

import HeroImage from '@/assets/images/colive.png';
import CoworkImage from '@/assets/images/cowork.png';
import CommunityImage from '@/assets/images/community.jpeg';

export const metadata: Metadata = {
  title: "Cocomanu - Coliving",
  description: "Our Coliving space",
  keywords: ['Coliving', 'Sumbul', 'Medewi'],
  robots: {
    index: false,
  },
};

export default function Colive() {
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
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 75vw, (max-width: 1280px) 90vw, 100vw"
        />
        <div className="absolute w-screen top-0">
          <TopNav />
        </div>
        <main className="flex h-screen items-center justify-center">
          <h1 className="text-ocean-blue-200 animate-fade-up animate-duration-500 animate-delay-1000">Colive</h1>
        </main>
      </div>

      <Introduction
        title="Living at Cocomanu"
        titleClassName="text-ocean-blue-200"
        image={
          <ColiveIllustration className="fill-ocean-blue-300"/>
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
        headerClassName="text-ocean-blue-200 pb-14"
        content={
          <Gallery
            arrowClassName="fill-ocean-blue-200 disabled:fill-ocean-blue-300"
            selectorClassName="bg-ocean-blue-200"
            images={[
              {
                src: CoworkImage,
                alt: 'Office',
                caption: 'Amazing office',
              },
              {
                src: HeroImage,
                alt: 'Home',
                caption: 'lololol',
              },
              {
                src: CoworkImage,
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

      <div className="flex items-center justify-center bg-black-sand p-20 md:px-[100px] lg:px-[300px] xl:px-[500px]">
        <p>
          Each private room features a queen-sized bed, ensuite bathrooms and a desk so you have the option to work in peace whenever you need your own space.
        </p>
      </div>

      <Section
        header="Your Room"
        headerClassName="text-ocean-blue-200 pb-14"
        content={
          <Gallery
            arrowClassName="fill-ocean-blue-200 disabled:fill-ocean-blue-300"
            selectorClassName="bg-ocean-blue-200"
            images={[
              {
                src: CoworkImage,
                alt: 'Office2',
                caption: 'Amazing office',
              },
              {
                src: HeroImage,
                alt: 'Home2',
                caption: 'lololol',
              },
              {
                src: CoworkImage,
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
        className="bg-black-sand"
        header="Facilities"
        headerClassName="text-ocean-blue-200"
        content={(
          <div className="grid grid-cols-2 md:grid-cols-4 px-10 md:px-20 py-20 lg:px-40 gap-12">
            <div className="facility intersect:animate-fade-up intersect-once text-dusk-glow-300">
              <Coworking className="size-24 lg:size-32 fill-transparent stroke-rainy-day" />
              Coworking Access
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-[100ms]">
              <Ensuite className="size-24 lg:size-32 fill-rainy-day" />
              Private ensuites
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-[200ms]">
              <Kitchen className="size-24 lg:size-32 fill-rainy-day" />
              Full Shared Kitchen
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-[300ms]">
              <Bar className="size-24 lg:size-32 fill-rainy-day" />
              Coffee Bar
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-[400ms]">
              <Projector className="size-24 lg:size-32 fill-rainy-day" />
              Movie Projector
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-[500ms]">
              <Couch className="size-24 lg:size-32 fill-rainy-day" />
              Giant Couch
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-[600ms]">
              <Pool className="size-24 lg:size-32 fill-rainy-day" />
              Swimming Pool
            </div>
            <div className="facility intersect:animate-fade-up intersect-once animate-delay-[700ms]">
              <Garden className="size-24 lg:size-32 fill-rainy-day" />
              Community Garden
            </div>
          </div>
        )}
      />

      <Section
        header="Pricing"
        headerClassName="pb-14 text-moss-green-200"
        content={
          <div className="flex flex-col md:flex-row md:items-start justify-center px-6 gap-y-12 gap-6 lg:gap-16">
            <PricingCard
              title="1 Night"
              perks={[
                'Includes a coworking day pass',
                'All coliving facilities',
              ]}
              price={
                <>
                  600K/
                  <span className="text-base">
                   night
                  </span>
                </>
              }
            />

            <PricingCard
              title="7-Nights"
              perks={[
                'Includes a 7-day coworking pass',
                'All coliving facilities',
              ]}
              price={
                <>
                  3.5M/
                  <span className="text-base">
                   week
                  </span>
                  <span className="text-base text-gray-400">
                    {' '}
                    (500k/night)
                  </span>
                </>
              }
            />

            <PricingCard
              title="30 Nights"
              perks={[
                'Includes a 7-day coworking pass',
                'All coliving facilities',
                'Weekly room cleaning',
              ]}
              price={
                <>
                  12M/
                  <span className="text-base">
                   month
                  </span>
                  <span className="text-base text-gray-400">
                    {' '}
                    (400k/night)
                  </span>
                </>
              }
            />
          </div>
        }
      />

      <div className="relative w-full h-[550px] lg:h-[700px]">
        <Image
          alt="Check our Community"
          src={CommunityImage}
          quality={10}
          loading="lazy"
          placeholder="blur"
          fill
          className="-z-10 object-cover contrast-[.25]"
        />
        <div className="flex flex-col h-full items-center justify-center gap-6">
          <h2>Why do we keep coming back?</h2>
          <div className="flex justify-center">
            <Link
              href="/community"
              className="flex items-center py-1 px-2 rounded-md bg-dawn-rays-200"
            >
              Community
              <ArrowRightIcon className="size-4 ml-1 font-bold"/>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
