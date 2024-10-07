import Image from 'next/image';

import TopNav from '@/components/TopNav';
import Introduction from '@/components/Introduction';
import Section from '@/components/Section';
import {
  Clap,
  SurfBoy,
  SurfGirl,
} from '@/components/svg';

export default function Community() {
  return (
    <div>
      <div id="hero">
        <Image
          alt="hero"
          src="/img/community.jpeg"
          quality={90}
          fill
          className="-z-10 object-cover"
          priority
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
          <>

            <div className="flex items-center w-full h-full">
              <SurfGirl className="fill-dawn-rays-300 intersect:animate-fade-right animate-duration-[2s] intersect-once mb-[55px] md:mb-[75px] -mr-[10px] lg:mb-[100px]" />
              <Clap className="fill-dawn-rays-300 size-10 intersect:animate-fade intersect-once animate-delay-[1.5s] animate-duration-200 intersect-once mb-[110px] md:mb-[150px] lg:mb-[200px]" />
              <SurfBoy className="fill-dawn-rays-300 intersect:animate-fade-left animate-duration-[2s] intersect-once mt-[55px] md:mt-[85px] -ml-[10px] lg:mt-[110px]" />
            </div>
          </>
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
