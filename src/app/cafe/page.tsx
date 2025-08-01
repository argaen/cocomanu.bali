import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';

import TopNav from '@/components/TopNav';
import Introduction from '@/components/Introduction';
import Section from '@/components/Section';
import Gallery from '@/components/Gallery';

import FarmMap from '@/components/svg/FarmMap';
import { CafeIllustration, LowWasteIllustration } from '@/components/svg';
import HeroImage from '@/assets/images/garden.jpeg';

export const metadata: Metadata = {
  title: "Cocomanu - Cafe",
  description: "Try our meals",
  keywords: ['food', 'meals', 'break'],
  robots: {
    index: false,
  },
};

export default function Cafe() {
  return (
    <div>
      <div id="hero" className="relative">
        <Image
          alt="Cafe"
          src={HeroImage}
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
        headerClassName="text-dawn-rays-200 text-4xl lg:text-5xl font-yeserva pb-14 px-14"
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
        headerClassName="text-moss-green-200 pb-14"
        className="bg-black-sand"
        content={
          <Gallery
            arrowClassName="fill-moss-green-200 disabled:fill-moss-green-300"
            selectorClassName="bg-moss-green-200"
            images={[
              {
                src: HeroImage,
                alt: 'Garden1',
                caption: 'Acerola',
              },
              {
                src: HeroImage,
                alt: 'Garden2',
                caption: 'Mango',
              },
              {
                src: HeroImage,
                alt: 'Garden2',
                caption: 'Mango',
              },
              {
                src: HeroImage,
                alt: 'Garden2',
                caption: 'Mango',
              },
            ]}
          />
        }
      />

      <Section
        header="Explore"
        headerClassName="text-moss-green-200 pb-14"
        content={
          <div>
            <div className="flex px-10 md:px-6 lg:px-12 justify-center items-center text-black-sand">
              <div className="md:w-4/6 lg:w-3/6 space-y-4">
                <p>
                  Curious about what&apos;s growing or where to find a shady spot to sit? 
                </p>
                <p>
                  Use our interactive garden map to navigate the space, discover key plant zones, and learn how different areas of the garden connect to our daily life at Cocomanu.
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <FarmMap className="h-[90vh]" />
            </div>
          </div>
        }
      />

      <Section
        header="Learn More"
        headerClassName="text-moss-green-200 pb-14"
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

      <div className="relative w-full h-[550px] lg:h-[700px]">
        <Image
          alt="Try our meals"
          src={HeroImage}
          quality={10}
          loading="lazy"
          placeholder="blur"
          fill
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
    </div>
  );
}
