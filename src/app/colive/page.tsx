import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

import TopNav from '@/components/TopNav';
import Introduction from '@/components/Introduction';
import Section from '@/components/Section';
import {
  Bar,
  CatTail,
  Couch,
  Coworking,
  Ensuite,
  Garden,
  Kitchen,
  Pool,
  Projector,
} from '@/components/svg';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';
import PricingCard from '@/components/PricingCard';

export default function Colive() {
  return (
    <div>
      <div id="hero">
        <Image
          alt="hero"
          src="/img/colive.png"
          quality={90}
          fill
          className="-z-10 object-cover"
          priority
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
          <>
            <Image
              src="/img/colive_illustration.svg"
              alt="Intro"
              fill
              className="object-contain"
            />
            <div className="flex w-full justify-center mt-[66px] md:mt-[100px] lg:mt-[138px]">
              <CatTail className="fill-ocean-blue-300 size-4 md:size-6 mr-[91px] md:mr-[137px] lg:mr-[180px] animate-wiggle-more animate-infinite animate-duration-[2s] origin-right" />
            </div>
          </>
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
                src: '/img/cowork.png',
                alt: 'Office',
                caption: 'Amazing office',
              },
              {
                src: '/img/colive.png',
                alt: 'Office',
                caption: 'lololol',
              },
              {
                src: '/img/cowork.png',
                alt: 'Office',
                caption: 'Lorem ipsum lololol',
              },
              {
                src: '/img/colive.png',
                alt: 'Office',
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
                src: '/img/cowork.png',
                alt: 'Office',
                caption: 'Amazing office',
              },
              {
                src: '/img/colive.png',
                alt: 'Office',
                caption: 'lololol',
              },
              {
                src: '/img/cowork.png',
                alt: 'Office',
                caption: 'Lorem ipsum lololol',
              },
              {
                src: '/img/colive.png',
                alt: 'Office',
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
          alt="hero"
          src="/img/community.jpeg"
          quality={90}
          fill
          className="-z-10 blur-sm object-cover"
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

      <Footer />
    </div>
  );
}
