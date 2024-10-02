import TopNav from '@/components/TopNav';
import Introduction from '@/components/Introduction';
import Image from 'next/image';
import Section from '@/components/Section';
import HeroImageContent from '@/components/HeroImageContent';
import {
  Starlink,
  Chairs,
  AC,
  PhoneBooth,
  MeetingRoom,
  Chillout,
  Coffee,
  Community,
  Treble,
  Note,
  DoubleNote,
} from '@/components/svg';

export default function Cowork() {
  return (
    <div>
      <div id="hero">
        <Image
          alt="hero"
          src="/img/cowork.png"
          quality={100}
          fill
          className="-z-10 object-cover"
          priority
        />
        <div className="absolute w-screen top-0">
          <TopNav />
        </div>
        <main className="flex h-screen items-center justify-center">
          <h1 className="text-dusk-glow-100">Cowork</h1>
        </main>
      </div>
      <Introduction
        title="Working at Cocomanu"
        titleClassName="text-dusk-glow-200"
        image={
          <>
            <Image
              src="/img/cowork_illustration.svg"
              alt="Intro"
              fill
              className="object-contain"
            />
            <div className="flex w-full justify-center">
              <Treble className="size-6 md:size-8 lg:size-10 xl:size-12 fill-dusk-glow-300 animate-fade-in-out animate-infinite"/>
              <Note className="size-6 md:size-8 lg:size-10 xl:size-12 fill-dusk-glow-300 relative -top-6 animate-fade-in-out animate-infinite animate-delay-[300ms]"/>
              <DoubleNote className="size-6 md:size-8 lg:size-10 xl:size-12 fill-dusk-glow-300 animate-fade-in-out animate-infinite animate-delay-[600ms]"/>
            </div>
          </>
        }
        content={(
          <div>
            <p className="mb-4">
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
        header="Your Oficce"
        headerClassName="text-dusk-glow-200"
        content={
          <HeroImageContent
            header="Cowork"
            headerClassName="text-dusk-glow-100 sm:text-dusk-glow-200"
            image="/img/cowork.png"
            contentClassName="bg-dusk-glow-100"
            imageClassName="intersect:animate-fade-right intersect-once"
            title="The Perfect Tropical Office"
            text="Everything you need to focus: High-speed WiFi, proper office chairs, phone booths, indoor AC, and an outdoor coffee bar for those refreshing breaks."
            href="/cowork"
          />
        }
      />
      <Section
        className="bg-black-sand"
        header="Facilities"
        headerClassName="text-ocean-blue-200"
        content={(
          <div className="flex flex-col py-20 gap-12">
            <div className="flex items-center justify-center text-dusk-glow-300 px-6 gap-4 sm:gap-x-16 md:gap-x-24 lg:gap-x-32">
              <div className="facility">
                <Starlink className="size-12 md:size-24 lg:size-32 fill-transparent stroke-rainy-day" />
                Starlink Wifi
              </div>
              <div className="facility animate-delay-[100ms]">
                <Chairs className="size-12 md:size-24 lg:size-32 fill-rainy-day" />
                Office Chairs
              </div>
              <div className="facility animate-delay-[200ms]">
                <AC className="size-12 md:size-24 lg:size-32 fill-rainy-day" />
                Full Indoor AC
              </div>
              <div className="facility animate-delay-[300ms]">
                <PhoneBooth className="size-12 md:size-24 lg:size-32 fill-rainy-day" />
                Phone Booths
              </div>
            </div>
            <div className="flex items-center justify-center text-dusk-glow-300 px-6 gap-4 sm:gap-16 md:gap-x-24 lg:gap-x-32">
              <div className="facility animate-delay-[400ms]">
                <MeetingRoom className="size-12 md:size-24 lg:size-32 fill-rainy-day" />
                Phone Booths
              </div>
              <div className="facility animate-delay-[500ms]">
                <Chillout className="size-12 md:size-24 lg:size-32 fill-rainy-day" />
                Phone Booths
              </div>
              <div className="facility animate-delay-[600ms]">
                <Coffee className="size-12 md:size-24 lg:size-32 fill-rainy-day" />
                Phone Booths
              </div>
              <div className="facility animate-delay-[700ms]">
                <Community className="size-12 md:size-24 lg:size-32 fill-rainy-day" />
                Phone Booths
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
