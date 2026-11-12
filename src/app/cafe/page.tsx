import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';

import CafeMenu from '@/components/CafeMenu';
import Introduction from '@/components/Introduction';
import Section from '@/components/Section';
import { CafeIllustration, LowWasteIllustration } from '@/components/svg';
import { getCafeMenu } from '@/lib/notion';
import { resolveLocalSiteImage } from '@/lib/site-images';
import {
  IMAGE_QUALITY_DECORATIVE,
  IMAGE_QUALITY_HERO,
  IMAGE_SIZES_FULL_VIEWPORT,
} from '@/lib/next-image';

/** Refresh Notion menu periodically (ISR). */
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Cocomanu - Cafe",
  description: "Try our meals",
  keywords: ['food', 'meals', 'break'],
  robots: {
    index: false,
  },
};

export default async function Cafe() {
  const cafeImage = resolveLocalSiteImage('cafe_1');
  const menu = await getCafeMenu();

  return (
    <div>
      <div id="hero" className="relative isolate">
        {cafeImage ? (
          <Image
            alt="Cafe"
            src={cafeImage}
            quality={IMAGE_QUALITY_HERO}
            fill
            className="z-0 object-cover"
            priority
            sizes={IMAGE_SIZES_FULL_VIEWPORT}
          />
        ) : null}
        <main className="relative z-10 flex h-screen items-center justify-center">
          <h1 className="text-dawn-rays-200 animate-fade-up animate-duration-500 animate-delay-1000">Cafe</h1>
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
        headerClassName="text-dawn-rays-200 !text-4xl lg:!text-4xl !font-yeserva pb-14 px-14"
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
        header="Menu"
        headerClassName="text-dawn-rays-200"
        className="bg-black-sand"
        content={<CafeMenu items={menu} />}
      />

      {cafeImage ? (
        <div className="relative isolate w-full h-[550px] lg:h-[700px]">
          <Image
            alt="Try our meals"
            src={cafeImage}
            quality={IMAGE_QUALITY_DECORATIVE}
            loading="lazy"
            fill
            sizes={IMAGE_SIZES_FULL_VIEWPORT}
            className="z-0 object-cover contrast-[.25]"
          />
          <div className="relative z-10 flex flex-col h-full items-center justify-center gap-6">
            <h2>Try our meals</h2>
            <div className="flex justify-center">
              <Link
                href="/cafe"
                className="cta bg-dawn-rays-200 before:bg-dawn-rays-100"
              >
                <span className="flex items-center py-1 px-2 z-10">
                  Cafe
                  <ArrowRightIcon className="size-4 ml-1 font-bold"/>
                </span>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
