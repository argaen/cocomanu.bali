import TopNav from '@/components/TopNav';
import Logo from '@/components/svg/Logo';
import Footer from '@/components/Footer';

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
      <Footer />
    </div>
  );
}
