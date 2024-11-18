import Logo from '@/components/svg/Logo';
import Section from '@/components/Section';
import Introduction from '@/components/Introduction';
import Image from 'next/image';
import HeroImageContent from '@/components/HeroImageContent';
import { WorkLifeIllustration } from '@/components/svg';

import HeroImage from '@/assets/images/photo1.png';
import CoworkImage from '@/assets/images/cowork.png';
import ColiveImage from '@/assets/images/colive.png';

export default function Home() {
  return (
    <main role="main">
      <div id="hero" className="relative">
        <Image
          alt="Welcome to Cocomanu"
          src={HeroImage}
          quality={90}
          fill
          className="-z-10 object-cover"
          placeholder="blur"
          priority
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 75vw, (max-width: 1280px) 90vw, 100vw"
        />
        <header role="banner" className="flex h-screen justify-center">
          <div className="relative top-1/3">
            <Logo className="h-32 sm:h-48 fill-moss-green-100 animate-fade-up animate-delay-1000" />
          </div>
        </header>
        <div className="absolute bottom-0 left-0 flex w-full text-center font-light items-end justify-center pb-8 animate-fade-up animate-delay-1000">
          Medewi | Yeh Sumbul
          <br />
          Bali, Indonesia
        </div>
      </div>
      <Introduction
        title="Where Work & Life Flow"
        titleClassName="text-moss-green-200"
        image={
          <WorkLifeIllustration className="fill-moss-green-300 overflow-visible" />
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
      <Section
        className="py-0"
        header="Cowork"
        headerClassName="text-dusk-glow-200 sm:hidden"
        content={
          <HeroImageContent
            header="Cowork"
            headerClassName="sm:text-dusk-glow-200"
            header2ClassName="text-dusk-glow-300"
            image={CoworkImage}
            contentClassName="bg-dusk-glow-100"
            imageClassName="intersect:animate-fade-right intersect-once hover:scale-110"
            linkClassName="bg-dusk-glow-200"
            title="The Perfect Tropical Office"
            text="Everything you need to focus: High-speed WiFi, proper office chairs, phone booths, indoor AC, and an outdoor coffee bar for those refreshing breaks."
            href="/cowork"
          />
        }
      />
      <Section
        className="py-0"
        header="Colive"
        headerClassName="text-ocean-blue-200 sm:hidden"
        content={
          <HeroImageContent
            header="Colive"
            headerClassName="sm:text-ocean-blue-200"
            header2ClassName="text-ocean-blue-300"
            image={ColiveImage}
            contentClassName="bg-ocean-blue-100"
            imageClassName="sm:order-2 intersect:animate-fade-left intersect-once"
            linkClassName="bg-ocean-blue-200"
            title="Home Away From Home"
            text="Miss the comfort and routine? You'll have a private ensuite in a villa with a shared full kitchen, a pool overlooking the river and seamless access to our coworking space."
            href="/colive"
          />
        }
      />
    </main>
  );
}
