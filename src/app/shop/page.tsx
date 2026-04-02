import Image from 'next/image';
import type { Metadata } from 'next';

import Section from '@/components/Section';
import ShopProductsSection from '@/components/ShopProductsSection';
import { getProducts } from '@/lib/notion';

import HeroImage from '@/assets/images/photo1.png';
import ProductPlaceholder from '@/assets/images/product_placeholder.webp';
import type { ShopItem } from '@/components/ShopCollection';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Cocomanu - Shop",
  description: "Shop products from Cocomanu",
  keywords: ['shop', 'products', 'cocomanu'],
  robots: {
    index: false,
  },
};

export default async function Shop() {
  const products = await getProducts();

  const items: ShopItem[] = products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    quantitySpec: p.quantitySpec,
    category: p.category,
    categoryColor: p.categoryColor,
    slug: p.slug,
    image: p.image || ProductPlaceholder,
  }));

  return (
    <div>
      <div id="hero" className="relative">
        <Image
          alt="Shop"
          src={HeroImage}
          quality={90}
          fill
          className="-z-10 object-cover"
          placeholder="blur"
          priority
          unoptimized
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 75vw, (max-width: 1280px) 90vw, 100vw"
        />
        <main className="flex h-screen items-center justify-center">
          <h1 className="text-moss-green-200 animate-fade-up animate-duration-500 animate-delay-1000">Shop</h1>
        </main>
      </div>

      <Section
        header="Our Products"
        headerClassName="text-moss-green-200"
        className="pt-40 md:pt-44 lg:pt-48"
        content={
          <div className="px-6 md:px-10 lg:px-20 text-black-sand">
            <ShopProductsSection items={items} />
          </div>
        }
      />
    </div>
  );
}
