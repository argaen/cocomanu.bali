'use client';

import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

import type { StaticImageData } from 'next/image';
import { PlusIcon } from '@heroicons/react/24/outline';

import CustomTooltip from '@/components/Tooltip';
import { useCart } from '@/context/CartContext';
import { formatProductPriceDisplay } from '@/lib/notion/product-price-format';
import type { ProductImageSrcSet, ProductQuantitySpec } from '@/lib/notion/types';

function packLabelFromSpec(spec: ProductQuantitySpec): string {
  const parts: string[] = [];
  if (spec.quantity > 0) parts.push(String(spec.quantity));
  if (spec.unit?.trim()) parts.push(spec.unit.trim());
  return parts.join(' ');
}

export type ShopItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantitySpec: ProductQuantitySpec;
  image: string | StaticImageData;
  imageSrcSet?: ProductImageSrcSet;
};

export type ShopCollectionProps = {
  items: ShopItem[];
  containerClassName?: string;
  itemClassName?: string;
};

export default function ShopCollection({
  items,
  containerClassName = '',
  itemClassName = '',
}: ShopCollectionProps) {
  const { addToCart } = useCart();

  return (
    <div className={twMerge('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 pb-10', containerClassName)}>
      <CustomTooltip id="shop-add-cart" />
      {items.map((item) => (
        <article
          key={item.id}
          className={twMerge(
            'flex h-full flex-col bg-white-water text-black-sand rounded-md shadow-md overflow-hidden',
            itemClassName,
          )}
        >
          <div className="relative h-52 w-full shrink-0">
            {item.imageSrcSet ? (
              <img
                src={item.imageSrcSet.desktop352w}
                srcSet={`${item.imageSrcSet.desktop352w} 352w, ${item.imageSrcSet.tablet358w} 358w, ${item.imageSrcSet.mobile654w} 654w`}
                sizes="(max-width: 768px) 100vw, 352px"
                loading="lazy"
                alt={item.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <Image
                src={item.image}
                alt={item.name}
                fill
                unoptimized
                className="object-cover"
              />
            )}
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
            <h3 className="shrink-0 text-xl font-bold text-moss-green-200">{item.name}</h3>
            <p className="min-h-0 flex-1 text-base leading-relaxed opacity-90">{item.description}</p>
            <div className="shrink-0 flex items-center justify-between gap-3">
              <p className="min-w-0 flex-1 text-base font-semibold text-moss-green-200">
                {formatProductPriceDisplay(item)}
              </p>
              <button
                type="button"
                data-tooltip-id="shop-add-cart"
                data-tooltip-content="Add to cart"
                onClick={() =>
                  addToCart({
                    productId: item.id,
                    name: item.name,
                    packLabel: packLabelFromSpec(item.quantitySpec),
                    unitPriceIdr: item.price,
                  })
                }
                className="shrink-0 flex size-10 cursor-pointer items-center justify-center rounded-full bg-moss-green-200 text-white-water shadow-md hover:bg-moss-green-100 transition-colors"
                aria-label={`Add ${item.name} to cart`}
              >
                <PlusIcon className="size-6" />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
