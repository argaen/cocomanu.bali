import TopNav from '@/components/TopNav';
import Logo from '@/components/svg/Logo';
import Footer from '@/components/Footer';
import Section from '@/components/Section';
import Introduction from '@/components/Introduction';
import Image from 'next/image';
import HeroImageContent from '@/components/HeroImageContent';
import { Laptop, WorkLife } from '@/components/svg';

export default function Home() {
  return (
    <div>
      <div id="hero">
        <Image
          alt="hero"
          src="/img/photo1.png"
          quality={90}
          fill
          className="-z-10 object-cover"
          priority
        />
        <div className="absolute w-screen top-0">
          <TopNav />
        </div>
        <main className="flex h-screen justify-center">
          <div className="relative top-1/3">
            <Logo className="h-32 sm:h-48 fill-moss-green-100 animate-fade-up animate-delay-1000" />
          </div>
        </main>
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
          <div className="flex flex-col items-center">
            <WorkLife className="md:h-[200px] lg:h-[250px] xl:h-[300px] fill-moss-green-300 float-left animate-wiggle animate-infinite animate-duration-[4s]" />
            <Laptop className="w-24 md:w-32 lg:w-48 fill-moss-green-300 -mt-5 md:-mt-8 lg:-mt-10 xl:-mt-12" />
          </div>
        }
        content={(
          <div>
            <p className="pb-4">
              Welcome to the first coworking and coliving space in the Medewi area.
            </p>
            <p className="pb-4">
              Here, your day starts with sunrise surf sessions and ends with wild sunsets over black sand beaches.
            </p>
            <p className="pb-4">
              In between, you&apos;ll find a peaceful spot to focus, surrounded by the natural beauty of West Bali.
            </p>
            <p className="pb-4">
              At Cocomanu, we&apos;ve created a place where you can get things done and enjoy the simple pleasures of island life.
            </p>
          </div>
        )}
      />
      <Section
        className="py-0"
        header="Cowork"
        headerClassName="text-dusk-glow-100 sm:text-dusk-glow-200 sm:hidden"
        content={
          <HeroImageContent
            header="Cowork"
            headerClassName="text-dusk-glow-100 sm:text-dusk-glow-200"
            image="/img/cowork.png"
            contentClassName="bg-dusk-glow-100"
            imageClassName="intersect:animate-fade-right intersect-once"
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
        headerClassName="text-ocean-blue-100 sm:text-ocean-blue-200 sm:hidden"
        content={
          <HeroImageContent
            header="Colive"
            headerClassName="text-ocean-blue-100 sm:text-ocean-blue-200"
            image="/img/colive.png"
            contentClassName="bg-ocean-blue-100"
            imageClassName="sm:order-2 intersect:animate-fade-left intersect-once"
            linkClassName="bg-ocean-blue-200"
            title="Home Away From Home"
            text="Miss the comfort and routine? You'll have a private ensuite in a villa with a shared full kitchen, a pool overlooking the river and seamless access to our coworking space."
            href="/colive"
          />
        }
      />
      <Section
        className="py-0"
        header="Community"
        headerClassName="text-dawn-rays-200 sm:text-dawn-rays-200 sm:hidden"
        content={
          <HeroImageContent
            header="Community"
            headerClassName="text-dawn-rays-200 sm:text-dawn-rays-200"
            image="/img/community.jpeg"
            contentClassName="bg-dawn-rays-100"
            imageClassName="intersect:animate-fade-right intersect-once"
            linkClassName="bg-dawn-rays-200"
            title="A Family Experience"
            text="Join a family of like-minded folks to surf together, embark on adventures, share dinners, and maybe even form friendships that last a lifetime."
            href="/community"
          />
        }
      />
      <Section
        className="py-0"
        header="West Bali"
        headerClassName="text-moss-green-200 sm:text-moss-green-200 sm:hidden"
        content={
          <HeroImageContent
            header="West Bali"
            headerClassName="text-moss-green-200 sm:text-moss-green-200"
            image="/img/west_bali.jpeg"
            contentClassName="bg-moss-green-100"
            imageClassName="sm:order-2 intersect:animate-fade-left intersect-once"
            linkClassName="bg-moss-green-200"
            title="The Bali You Missed"
            text="Discover the untouched beauty of West Bali, a region where time slows down and nature takes center stage."
            href="/west-bali"
          />
        }
      />
      <Footer />
    </div>
  );
}
