import Image from 'next/image';
import type { Metadata } from 'next';

import TopNav from '@/components/TopNav';
import Introduction from '@/components/Introduction';
import { CowIllustration } from '@/components/svg';

import HeroImage from '@/assets/images/photo1.png';
import Section from '@/components/Section';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Cocomanu - Tropical Garden",
  description: "Discover our tropical garden",
  keywords: ['garden', 'tropical', 'organic'],
  robots: {
    index: false,
  },
};

export default function Garden() {
  return (
    <div>
      <div id="hero" className="relative">
        <Image
          alt="Garden"
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
          <h1 className="text-moss-green-200 animate-fade-up animate-duration-500 animate-delay-1000">Tropical Garden</h1>
        </main>
      </div>

      <Introduction
        title="Nature At Home"
        titleClassName="text-moss-green-200"
        image={
          <CowIllustration className="fill-moss-green-300" />
        }
        content={(
          <div className="space-y-4">
            <p>
              At Cocomanu we love nature and we want to share this love with you.
            </p>

            <p>
              Abundance and tranquility thrive at our garden. Spend your time harvesting sun-ripened fruit, discovering new insects or reading your favorite book beneath the canopy.
            </p>

            <p>
              This is where the magic of nature&apos;s bounty meets the joy of simple living.
            </p>
          </div>
        )}
      />

      <Section
        header="Plants"
        headerClassName="text-moss-green-200 pb-14"
        content={
          <div>
            Check our
            {' '}
            <Link href="/garden/plants">
              plants
            </Link>
          </div>
        }
      />
    </div>
  );
}
