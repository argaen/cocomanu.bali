import type { Metadata } from 'next';

import ShopProductsSection from '@/components/ShopProductsSection';
import { getProducts } from '@/lib/notion';
import { resolveLocalShopImage } from '@/lib/shop-images';

import ProductPlaceholder from '@/assets/images/product_placeholder.webp';
import type { ShopItem } from '@/components/ShopCollection';

export const revalidate = 300;

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
    image: resolveLocalShopImage(p.slug, p.image || ProductPlaceholder.src),
  }));

  return (
    <div className="pt-24 md:pt-28 lg:pt-32">
      <div className="px-6 md:px-10 lg:px-20 text-black-sand">
        <ShopProductsSection items={items} />
      </div>
    </div>
  );
}
