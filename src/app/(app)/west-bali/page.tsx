import Image from 'next/image';
import type { Metadata } from 'next';

import TopNav from '@/components/TopNav';
import Introduction from '@/components/Introduction';
import { CowIllustration } from '@/components/svg';

import HeroImage from '@/assets/images/west_bali.jpeg';

export const metadata: Metadata = {
  title: "Cocomanu - West Bali",
  description: "What to find in West Bali",
  keywords: ['West Bali', 'Sumbul', 'Medewi'],
  robots: {
    index: false,
  },
};

export default function WestBali() {
  return (
    <div>
      <div id="hero" className="relative">
        <Image
          alt="West Bali"
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
          <h1 className="text-moss-green-200 animate-fade-up animate-duration-500 animate-delay-1000">West Bali</h1>
        </main>
      </div>

      <Introduction
        title="West is Best"
        titleClassName="text-moss-green-200"
        image={
          <CowIllustration className="fill-moss-green-300" />
        }
        content={(
          <div className="space-y-4">
            <p>
              Why choose a peaceful corner far from crowded tourist hubs, where grazing cattle still roam the fields?
            </p>

            <p>
              Why Medewi, with its long, rolling waves, or Yeh Sumbul, where lush rice paddies meet black sand beaches? Here, adventure and serenity coexist - whether you&apos;re surfing at dawn, discovering hidden waterfalls, or soaking in golden sunsets.
            </p>

            <p>
              This is where life&apos;s simple pleasures take center stage.
            </p>
          </div>
        )}
      />
    </div>
  );
}
