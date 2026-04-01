import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import type { NotionBlock } from '@9gustin/react-notion-render';

import { getProductDetail, getProducts, formatProductPriceDisplay } from '@/lib/notion';
import RenderNotion from '@/components/notion/RenderNotion';
import ProductPlaceholder from '@/assets/images/product_placeholder.webp';

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await getProductDetail(slug);

  return {
    title: `${product.name} - Shop`,
    description: product.description || `Learn more about ${product.name}`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const { product, blocks } = await getProductDetail(slug);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 pb-10 pt-28 md:pt-32 text-black-sand">
      <Link href="/shop" className="text-moss-green-200 hover:text-moss-green-100">
        Back to shop
      </Link>
      <article className="mt-4 overflow-hidden rounded-xl bg-white-water shadow-md">
        <div className="relative h-72 w-full">
          <Image
            src={product.image || ProductPlaceholder}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-4 p-6">
          <h1 className="text-3xl font-bold text-moss-green-200">{product.name}</h1>
          <p className="text-lg font-semibold text-moss-green-200">
            {formatProductPriceDisplay(product)}
          </p>
          {blocks.length > 0 ? (
            <RenderNotion blocks={blocks as NotionBlock[]} />
          ) : (
            <p className="text-black-sand/80">{product.description}</p>
          )}
        </div>
      </article>
    </div>
  );
}
