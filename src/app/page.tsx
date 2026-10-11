import Logo from '@/components/svg/Logo';
import Section from '@/components/Section';
import Introduction from '@/components/Introduction';
import Image from 'next/image';
import HeroImageContent from '@/components/HeroImageContent';
import { WorkLifeIllustration } from '@/components/svg';

import { resolveLocalSiteImage } from '@/lib/site-images';
import {
  IMAGE_QUALITY_HERO,
  IMAGE_SIZES_FULL_VIEWPORT,
} from '@/lib/next-image';

export default function Home() {
  const gardenImage = resolveLocalSiteImage('garden_1');
  const coworkImage = resolveLocalSiteImage('cowork_1');
  const coliveImage = resolveLocalSiteImage('colive_1');

  return (
    <main role="main">
      <div id="hero" className="relative isolate">
        {gardenImage ? (
          <Image
            alt="Welcome to Cocomanu"
            src={gardenImage}
            quality={IMAGE_QUALITY_HERO}
            fill
            className="z-0 object-cover"
            priority
            sizes={IMAGE_SIZES_FULL_VIEWPORT}
          />
        ) : null}
        <header role="banner" className="relative z-10 flex h-screen justify-center">
          <div className="relative top-1/3">
            <Logo className="h-32 sm:h-48 fill-white-water animate-fade-up animate-delay-1000" />
          </div>
        </header>
        <div className="absolute bottom-0 left-0 z-10 flex w-full text-center font-light items-end justify-center pb-8 animate-fade-up animate-delay-1000">
          Medewi | Yeh Sumbul
          <br />
          Bali, Indonesia
        </div>
      </div>

      <Introduction
        title="Where Work and Life Flow"
        titleClassName="text-moss-green-200"
        image={
          <WorkLifeIllustration className="fill-moss-green-100 overflow-visible" />
        }
        content={(
          <div className="space-y-4">
            <p>
              Welcome to the first coworking and coliving space in the Medewi area.
            </p>
            <p>
              Here, your day starts with sunrise surf sessions and ends with wild sunsets over black sand beaches.
            </p>
            <p>
              In between, you&apos;ll find a peaceful spot to focus, surrounded by the natural beauty of West Bali.
            </p>
            <p>
              At Cocomanu, we&apos;ve created a place where you can get things done and enjoy the simple pleasures of island life.
            </p>
          </div>
        )}
      />
      {coworkImage ? (
        <Section
          className="!py-0"
          header="Cowork"
          headerClassName="text-dusk-glow-200 sm:hidden mt-12 -mb-7 pb-0"
          content={
            <HeroImageContent
              header="Cowork"
              headerClassName="sm:text-dusk-glow-200"
              header2ClassName="text-dusk-glow-300"
              image={coworkImage}
              contentClassName="bg-dusk-glow-100"
              imageClassName="intersect:animate-fade-right intersect-once"
              imageInnerClassName="scale-[1.01]"
              linkClassName="bg-dusk-glow-200 before:bg-dusk-glow-100"
              title="The Perfect Tropical Office"
              text="Everything you need to stay focused is here: fast WiFi, air-conditioned indoor spaces, office chairs, phone booths, an open-air café, and a rooftop for when you need a break."
              href="/cowork"
            />
          }
        />
      ) : null}
      {coliveImage ? (
        <Section
          className="!py-0"
          header="Colive"
          headerClassName="text-ocean-blue-200 sm:hidden mt-12 -mb-7 pb-0"
          content={
            <HeroImageContent
              header="Colive"
              headerClassName="sm:text-ocean-blue-200"
              header2ClassName="text-ocean-blue-300"
              image={coliveImage}
              contentClassName="bg-ocean-blue-100"
              imageClassName="sm:order-2 intersect:animate-fade-left intersect-once"
              imageInnerClassName="scale-[1.01]"
              linkClassName="bg-ocean-blue-200 before:bg-ocean-blue-100"
              title="Home Away From Home"
              text="Missing a bit of comfort and routine? You’ll have your own private bathroom and patio, a shared kitchen, and natural pool — all connected to the coworking space."
              href="/colive"
            />
          }
        />
      ) : null}
      {gardenImage ? (
        <Section
          className="!py-0"
          header="Garden"
          headerClassName="text-moss-green-200 sm:hidden mt-12 -mb-7 pb-0"
          content={
            <HeroImageContent
              header="Garden"
              headerClassName="sm:text-moss-green-200"
              header2ClassName="text-moss-green-300"
              image={gardenImage}
              contentClassName="bg-moss-green-100"
              imageClassName="intersect:animate-fade-left intersect-once"
              linkClassName="bg-moss-green-200 before:bg-moss-green-100"
              title="Nature At Home"
              text="Take a walk through our 2,000 sqm fruit and vegetable garden, unwind by the ponds, and say hello to our friendly farm animals whenever you need a reset."
              href="/garden"
              linkText="Coming soon"
              linkDisabled
            />
          }
        />
      ) : null}
    </main>
  );
}
