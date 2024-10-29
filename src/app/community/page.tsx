import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';

import Introduction from '@/components/Introduction';
import { CommunityIllustration } from '@/components/svg';

import HeroImage from '@/assets/images/community.jpeg';
import WestBaliImage from '@/assets/images/west_bali.jpeg';

export const metadata: Metadata = {
  title: "Cocomanu - Community",
  description: "Our Community",
  keywords: ['Community', 'Sumbul', 'Medewi'],
  robots: {
    index: false,
  },
};

export default function Community() {
  return (
    <div>
      <div id="hero" className="relative">
        <Image
          alt="Our Community"
          src={HeroImage}
          quality={90}
          fill
          className="-z-10 object-cover"
          placeholder="blur"
          priority
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 75vw, (max-width: 1280px) 90vw, 100vw"
        />
        <main className="flex h-screen items-center justify-center">
          <h1 className="text-dawn-rays-200 animate-fade-up animate-duration-500 animate-delay-1000">Community</h1>
        </main>
      </div>

      <Introduction
        title="The Heart of Cocomanu"
        titleClassName="text-dawn-rays-200"
        image={
          <CommunityIllustration className="fill-dawn-rays-300" />
        }
        content={(
          <div className="space-y-4">
            <p>
              Here, you&apos;re not just living in a beautiful setting - you&apos;re joining a community of like-minded individuals, travellers and locals alike who bring their own unique perspective and stories.
            </p>
            <p>
              We don&apos; know why we keep coming back here... but maybe it&apos;s because of the feeling that we can just be ourselves.
            </p>
          </div>
        )}
      />

      <div className="relative w-full h-[550px] lg:h-[700px]">
        <Image
          alt="Check our Community"
          src={WestBaliImage}
          quality={10}
          loading="lazy"
          placeholder="blur"
          fill
          className="-z-10 object-cover contrast-[.25]"
        />
        <div className="flex flex-col h-full items-center justify-center gap-6">
          <h2>What&apos;s on this side of Bali</h2>
          <div className="flex justify-center">
            <Link
              href="/community"
              className="cta bg-moss-green-200 before:bg-moss-green-100"
            >
              <span className="flex items-center py-1 px-2 z-10">
                West Bali
                <ArrowRightIcon className="size-4 ml-1 font-bold"/>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
