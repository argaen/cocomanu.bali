import TopNav from '@/components/TopNav';
import Logo from '@/components/svg/Logo';
import Footer from '@/components/Footer';
import Section from '@/components/Section';
import Introduction from '@/components/Introduction';

export default function Home() {
  return (
    <div>
      <div id="hero" className="bg-[url('/img/photo1.png')]">
        <div className="absolute w-screen top-0">
          <TopNav />
        </div>
        <main className="flex h-screen items-center justify-center">
          <Logo className="h-32 sm:h-48 fill-white-water"/>
        </main>
        <div className="absolute bottom-0 left-0 flex w-full text-center font-light text-xs items-end justify-center pb-8">
          Medewi | Yeh Sumbul
          <br />
          Bali, Indonesia
        </div>
      </div>
      <Introduction
        image="/img/work_life.jpg"
      />
      <Section
        header="Cowork"
        bg="/img/cowork.png"
        headerClassName="text-dusk-glow-100 sm:text-dusk-glow-200"
        contentClassName="bg-dusk-glow-100"
        title="The Perfect Tropical Office"
        text="Everything you need to focus: High-speed WiFi, proper office chairs, phone booths, indoor AC, and an outdoor coffee bar for those refreshing breaks."
      />
      <Section
        header="Colive"
        bg="/img/colive.png"
        headerClassName="text-ocean-blue-100 sm:text-ocean-blue-200"
        contentClassName="bg-ocean-blue-100"
        imageClassName="sm:order-2"
        title="Home Away From Home"
        text="Miss the comfort and routine? You'll have a private ensuite in a villa with a shared full kitchen, a pool overlooking the river and seamless access to our coworking space."
      />
      <Section
        header="Community"
        bg="/img/community.jpeg"
        headerClassName="text-dawn-rays-200 sm:text-dawn-rays-200"
        contentClassName="bg-dawn-rays-100"
        title="A Family Experience"
        text="Join a family of like-minded folks to surf together, embark on adventures, share dinners, and maybe even form friendships that last a lifetime."
      />
      <Section
        header="West Bali"
        bg="/img/west_bali.jpeg"
        headerClassName="text-moss-green-200 sm:text-moss-green-200"
        contentClassName="bg-moss-green-100"
        imageClassName="sm:order-2"
        title="The Bali You Missed"
        text="Discover the untouched beauty of West Bali, a region where time slows down and nature takes center stage."
      />
      <Footer />
    </div>
  );
}
