import Image from 'next/image';
import type { Metadata } from 'next';

import Introduction from '@/components/Introduction';
import { CommunityIllustration } from '@/components/svg';

import HeroImage from '@/assets/images/community.jpeg';
import {
  IMAGE_QUALITY_HERO,
  IMAGE_SIZES_FULL_VIEWPORT,
} from '@/lib/next-image';

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
      <div id="hero" className="relative isolate">
        <Image
          alt="Our Community"
          src={HeroImage}
          quality={IMAGE_QUALITY_HERO}
          fill
          className="z-0 object-cover"
          placeholder="blur"
          priority
          sizes={IMAGE_SIZES_FULL_VIEWPORT}
        />
        <main className="relative z-10 flex h-screen items-center justify-center">
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
    </div>
  );
}
