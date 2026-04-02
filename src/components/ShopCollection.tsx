'use client';

import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { NotionBlock } from '@9gustin/react-notion-render';

import type { StaticImageData } from 'next/image';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Carrot, Flower2, Leaf, Shovel, Tag } from 'lucide-react';

import CustomTooltip from '@/components/Tooltip';
import RenderNotion from '@/components/notion/RenderNotion';
import { useCart } from '@/context/CartContext';
import { formatProductPriceDisplay } from '@/lib/notion/product-price-format';
import type { ProductQuantitySpec } from '@/lib/notion/types';

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
  category: string;
  categoryColor: string;
  slug: string;
  image: string | StaticImageData;
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
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [detailBlocks, setDetailBlocks] = useState<NotionBlock[]>([]);
  const [modalItem, setModalItem] = useState<ShopItem | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState('');

  useEffect(() => {
    if (!selectedItem) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedItem]);

  function categoryIcon(category: string): ReactNode {
    const normalized = category.trim().toLowerCase();

    if (normalized === 'flowers') return <Flower2 className="size-5" />;
    if (normalized === 'fresh herbs') return <Leaf className="size-5" />;
    if (normalized === 'vegetables') return <Carrot className="size-5" />;
    if (normalized === 'gardening') return <Shovel className="size-5" />;

    return <Tag className="size-5" />;
  }

  async function openProductDetail(item: ShopItem) {
    setSelectedItem(item);
    setDetailError('');
    setDetailBlocks([]);
    setModalItem(null);
    setIsLoadingDetail(true);

    try {
      const response = await fetch(`/api/products/by-slug/${encodeURIComponent(item.slug)}`);
      if (!response.ok) {
        throw new Error('Request failed');
      }
      const data = (await response.json()) as {
        product?: {
          id: string;
          name: string;
          description: string;
          price: number;
          quantitySpec: ProductQuantitySpec;
          category: string;
          categoryColor: string;
          slug: string;
          image: string;
        };
        blocks?: NotionBlock[];
      };
      if (data.product) {
        setModalItem({
          ...data.product,
          image: data.product.image || item.image,
        });
      } else {
        setModalItem(item);
      }
      setDetailBlocks(Array.isArray(data.blocks) ? data.blocks : []);
    } catch {
      setDetailError('Unable to load product details right now.');
      setModalItem(item);
    } finally {
      setIsLoadingDetail(false);
    }
  }

  return (
    <>
      <div className={twMerge('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 pb-10', containerClassName)}>
        <CustomTooltip id="shop-add-cart" />
        <CustomTooltip id="shop-category" />
        {items.map((item) => (
          <article
            key={item.id}
            role="button"
            tabIndex={0}
            onClick={() => openProductDetail(item)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                void openProductDetail(item);
              }
            }}
            className={twMerge(
              'flex h-full cursor-pointer flex-col bg-white-water text-black-sand rounded-md shadow-md overflow-hidden transition-shadow hover:shadow-lg',
              itemClassName,
            )}
          >
            <div className="relative h-52 w-full shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
              <div className="shrink-0 flex items-center gap-2">
                <h3 className="text-xl font-bold text-moss-green-200">{item.name}</h3>
                {item.category && (
                  <span
                    data-tooltip-id="shop-category"
                    data-tooltip-content={item.category}
                    aria-label={item.category}
                    className="inline-flex items-center justify-center"
                    style={{ color: item.categoryColor || '#928E43', opacity: 0.92 }}
                  >
                    {categoryIcon(item.category)}
                  </span>
                )}
              </div>
              <p className="min-h-0 flex-1 text-base leading-relaxed opacity-90">{item.description}</p>
              <div className="shrink-0 flex items-center justify-between gap-3">
                <p className="min-w-0 flex-1 text-base font-semibold text-moss-green-200">
                  {formatProductPriceDisplay(item)}
                </p>
                <button
                  type="button"
                  data-tooltip-id="shop-add-cart"
                  data-tooltip-content="Add to cart"
                  onClick={(event) => {
                    event.stopPropagation();
                    addToCart({
                      productId: item.id,
                      name: item.name,
                      packLabel: packLabelFromSpec(item.quantitySpec),
                      unitPriceIdr: item.price,
                    });
                  }}
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

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedItem.name} details`}
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white-water shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative h-56 w-full shrink-0">
              <Image
                src={(modalItem?.image || selectedItem.image) as string | StaticImageData}
                alt={modalItem?.name || selectedItem.name}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="absolute right-3 top-3 cursor-pointer rounded-full bg-white-water/90 p-2 text-moss-green-200 shadow hover:bg-white-water"
                aria-label="Close"
              >
                <XMarkIcon className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 pb-10">
              <div className="mb-6">
                <h3 className="text-3xl font-bold text-moss-green-200 md:text-4xl">{modalItem?.name || selectedItem.name}</h3>
                <p className="mt-1 text-lg font-semibold text-moss-green-200">
                  {formatProductPriceDisplay(modalItem || selectedItem)}
                </p>
              </div>
              {isLoadingDetail ? (
                <p className="text-black-sand/70">Loading description...</p>
              ) : detailBlocks.length > 0 ? (
                <RenderNotion blocks={detailBlocks} />
              ) : (
                <p className="whitespace-pre-line text-base leading-relaxed text-black-sand">
                  {(modalItem?.description || selectedItem.description)}
                </p>
              )}
              {detailError ? (
                <p className="mt-3 text-sm text-red-700">{detailError}</p>
              ) : null}
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-moss-green-300/30 px-4 pb-4 pt-5">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="cursor-pointer rounded-md border border-moss-green-300 px-3 py-1 text-sm text-moss-green-200 hover:border-moss-green-200"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() =>
                  addToCart({
                    productId: (modalItem || selectedItem).id,
                    name: (modalItem || selectedItem).name,
                    packLabel: packLabelFromSpec((modalItem || selectedItem).quantitySpec),
                    unitPriceIdr: (modalItem || selectedItem).price,
                  })
                }
                className="cursor-pointer rounded-md bg-moss-green-200 px-4 py-2 text-sm font-semibold text-white-water hover:bg-moss-green-100"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
