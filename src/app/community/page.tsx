import Image from 'next/image';
import type { Metadata } from 'next';

import TopNav from '@/components/TopNav';
import Introduction from '@/components/Introduction';
import { CommunityIllustration } from '@/components/svg';

import HeroImage from '@/assets/images/community.jpeg';

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
        <div className="absolute w-screen top-0">
          <TopNav />
        </div>
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
          <div>
            <p className="mb-4">
              Here, you&apos;re not just living in a beautiful setting - you&apos;re joining a community of like-minded individuals, travellers and locals alike who bring their own unique perspective and stories.
            </p>
            <p>
              We don&apos; know why we keep coming back here... but maybe it&apos;s because of the feeling that we can just be ourselves.
            </p>
          </div>
        )}
      />
    </div>
  );
}
