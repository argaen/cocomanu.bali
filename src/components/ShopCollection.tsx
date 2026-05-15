'use client';

import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import type { NotionBlock } from '@9gustin/react-notion-render';

import type { StaticImageData } from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Carrot, ChefHat, Flower2, Shovel, Sprout, Tag } from 'lucide-react';

import CustomTooltip from '@/components/Tooltip';
import RenderNotion from '@/components/notion/RenderNotion';
import { useCart } from '@/context/CartContext';
import { formatProductPriceDisplay } from '@/lib/notion/product-price-format';
import type { ProductQuantitySpec } from '@/lib/notion/types';
import ProductPlaceholder from '@/assets/images/product_placeholder.webp';

/** Tiny SVG blur for remote `next/image` URLs (theme-neutral warm gray). */
const REMOTE_IMAGE_BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2U4ZTZkZCIvPjwvc3ZnPg==';

function blurPlaceholderProps(src: string | StaticImageData) {
  if (typeof src === 'string') {
    return {
      placeholder: 'blur' as const,
      blurDataURL: REMOTE_IMAGE_BLUR_DATA_URL,
    };
  }
  return { placeholder: 'blur' as const };
}

function packLabelFromSpec(spec: ProductQuantitySpec): string {
  const parts: string[] = [];
  if (spec.quantity > 0) parts.push(String(spec.quantity));
  if (spec.unit?.trim()) parts.push(spec.unit.trim());
  return parts.join(' ');
}

export type ShopItem = {
  id: string;
  name: string;
  variant: string;
  groupKey: string;
  description: string;
  price: number;
  quantitySpec: ProductQuantitySpec;
  category: string;
  categoryColor: string;
  slug: string;
  image: string | StaticImageData;
};

function displayNameForCart(item: Pick<ShopItem, 'name' | 'variant'>): string {
  if (item.variant?.trim()) return `${item.name} (${item.variant.trim()})`;
  return item.name;
}

type ShopGalleryDir = 'next' | 'prev';

type ShopGalleryEntry = {
  index: number;
  dir: ShopGalleryDir;
};

export type ShopCollectionProps = {
  items: ShopItem[];
  /** Full product list for `?p=` deep links (defaults to `items`). */
  catalogItems?: ShopItem[];
  containerClassName?: string;
  itemClassName?: string;
};

export default function ShopCollection({
  items,
  catalogItems: catalogItemsProp,
  containerClassName = '',
  itemClassName = '',
}: ShopCollectionProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlProductSlug = searchParams.get('p');

  const catalogItems = catalogItemsProp ?? items;
  const closedSlugRef = useRef<string | null>(null);
  /** Avoid treating URL as “missing product” until `router.replace` has applied (Next can lag one frame). */
  const pendingSlugInUrlRef = useRef<string | null>(null);
  const { addToCart } = useCart();
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [detailBlocks, setDetailBlocks] = useState<NotionBlock[]>([]);
  const [modalItem, setModalItem] = useState<ShopItem | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [failedImageIds, setFailedImageIds] = useState<Record<string, true>>({});
  const [showTooltips, setShowTooltips] = useState(false);
  /** Per-group variant index + last navigation direction (for slide animation). */
  const [groupGallery, setGroupGallery] = useState<Record<string, ShopGalleryEntry>>({});

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updateTooltips = () => setShowTooltips(mediaQuery.matches);
    updateTooltips();
    mediaQuery.addEventListener('change', updateTooltips);
    return () => mediaQuery.removeEventListener('change', updateTooltips);
  }, []);

  const itemGroups = useMemo(() => {
    const map = new Map<string, ShopItem[]>();
    for (const item of items) {
      const key = (item.groupKey || item.name).trim() || item.slug;
      const list = map.get(key);
      if (list) list.push(item);
      else map.set(key, [item]);
    }
    const entries = Array.from(map.entries()).map(([groupLabel, groupItems]) => ({
      groupLabel,
      groupItems: [...groupItems].sort((a, b) => {
        const va = (a.variant || a.slug).toLowerCase();
        const vb = (b.variant || b.slug).toLowerCase();
        return va.localeCompare(vb);
      }),
    }));
    entries.sort((a, b) => a.groupLabel.localeCompare(b.groupLabel));
    return entries;
  }, [items]);

  useEffect(() => {
    setGroupGallery({});
  }, [items]);

  useEffect(() => {
    if (!urlProductSlug) return;
    for (const group of itemGroups) {
      const idx = group.groupItems.findIndex((i) => i.slug === urlProductSlug);
      if (idx >= 0) {
        setGroupGallery((prev) => ({
          ...prev,
          [group.groupLabel]: {
            index: idx,
            dir: prev[group.groupLabel]?.dir ?? 'next',
          },
        }));
        break;
      }
    }
  }, [urlProductSlug, itemGroups]);

  useEffect(() => {
    if (!selectedItem) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedItem]);

  const syncProductUrl = useCallback(
    (slug: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (slug) {
        params.set('p', slug);
      } else {
        params.delete('p');
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const closeProductModal = useCallback(() => {
    if (selectedItem?.slug) {
      closedSlugRef.current = selectedItem.slug;
    }
    pendingSlugInUrlRef.current = null;
    syncProductUrl(null);
    setSelectedItem(null);
    setModalItem(null);
    setDetailBlocks([]);
    setDetailError('');
    setIsLoadingDetail(false);
  }, [syncProductUrl, selectedItem?.slug]);

  useEffect(() => {
    if (!selectedItem) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeProductModal();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [selectedItem, closeProductModal]);

  const openProductDetail = useCallback(
    async (item: ShopItem) => {
      closedSlugRef.current = null;
      pendingSlugInUrlRef.current = item.slug;
      syncProductUrl(item.slug);
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
            variant?: string;
            groupKey?: string;
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
            ...item,
            ...data.product,
            variant: data.product.variant ?? item.variant,
            groupKey: data.product.groupKey ?? item.groupKey,
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
    },
    [syncProductUrl],
  );

  useEffect(() => {
    if (urlProductSlug) {
      pendingSlugInUrlRef.current = null;
    }
  }, [urlProductSlug]);

  useEffect(() => {
    if (!urlProductSlug) {
      if (pendingSlugInUrlRef.current) {
        return;
      }
      if (selectedItem) {
        setSelectedItem(null);
        setModalItem(null);
        setDetailBlocks([]);
        setDetailError('');
        setIsLoadingDetail(false);
      }
      closedSlugRef.current = null;
      return;
    }
    if (catalogItems.length === 0) {
      closedSlugRef.current = null;
      return;
    }
    if (closedSlugRef.current === urlProductSlug) {
      return;
    }
    if (selectedItem?.slug === urlProductSlug) {
      return;
    }
    const match = catalogItems.find((i) => i.slug === urlProductSlug);
    if (!match) {
      return;
    }
    void openProductDetail(match);
  }, [urlProductSlug, catalogItems, selectedItem, openProductDetail]);

  function categoryIcon(category: string): ReactNode {
    const normalized = category.trim().toLowerCase();

    if (normalized === 'flowers') return <Flower2 className="size-5" />;
    if (normalized === 'vegetables') return <Carrot className="size-5" />;
    if (normalized === 'garden') return <Shovel className="size-5" />;
    if (
      normalized === 'herbs & medicinal plants'
      || normalized === 'herbs and medicinal plants'
    ) {
      return <Sprout className="size-5" />;
    }
    if (normalized === 'homemade products') return <ChefHat className="size-5" />;

    return <Tag className="size-5" />;
  }

  return (
    <>
      <div className={twMerge('grid grid-cols-1 gap-6 pt-6 pb-10 md:grid-cols-2 lg:grid-cols-4', containerClassName)}>
        {showTooltips ? <CustomTooltip id="shop-add-cart" /> : null}
        {showTooltips ? <CustomTooltip id="shop-category" /> : null}
        {itemGroups.map(({ groupLabel, groupItems }, groupIndex) => {
          const len = groupItems.length;
          const entry = groupGallery[groupLabel];
          const rawSlide = entry?.index ?? 0;
          const slide = len > 0 ? Math.min(Math.max(0, rawSlide), len - 1) : 0;
          const slideDir: ShopGalleryDir = entry?.dir ?? 'next';
          const item = groupItems[slide] ?? groupItems[0];
          if (!item) return null;

          const showGallery = len > 1;
          const cardHeading = displayNameForCart(item);
          const atStart = slide <= 0;
          const atEnd = slide >= len - 1;

          const bumpSlide = (delta: number) => (event: MouseEvent) => {
            event.stopPropagation();
            setGroupGallery((prev) => {
              const curEntry = prev[groupLabel];
              const cur = Math.min(Math.max(0, curEntry?.index ?? 0), len - 1);
              const next = cur + delta;
              if (next < 0 || next > len - 1) return prev;
              return {
                ...prev,
                [groupLabel]: {
                  index: next,
                  dir: delta > 0 ? 'next' : 'prev',
                },
              };
            });
          };

          return (
            <article
              key={groupLabel}
              role="button"
              tabIndex={0}
              data-gallery-dir={showGallery ? slideDir : undefined}
              onClick={() => {
                void openProductDetail(item);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  void openProductDetail(item);
                }
              }}
              className={twMerge(
                'flex h-full cursor-pointer flex-col overflow-hidden rounded-md bg-white-water text-black-sand shadow-md transition-shadow hover:shadow-lg',
                itemClassName,
              )}
            >
              <div className="relative h-52 w-full shrink-0 overflow-hidden bg-moss-green-100/15">
                {showGallery ? (
                  groupItems.map((v) => {
                    const isActive = v.id === item.id;
                    const src = failedImageIds[v.id] ? ProductPlaceholder : v.image;
                    return (
                      <div
                        key={v.id}
                        className={twMerge(
                          'absolute inset-0 transition-opacity duration-200 ease-out',
                          isActive ? 'z-[1] opacity-100' : 'z-0 opacity-0 pointer-events-none',
                        )}
                        aria-hidden={!isActive}
                      >
                        <Image
                          src={src}
                          alt={isActive ? displayNameForCart(v) : ''}
                          fill
                          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw"
                          priority={groupIndex < 4 && v.id === groupItems[0]?.id}
                          loading="eager"
                          className="object-cover"
                          {...blurPlaceholderProps(src)}
                          onError={() =>
                            setFailedImageIds((prev) => ({
                              ...prev,
                              [v.id]: true,
                            }))
                          }
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="absolute inset-0">
                    <Image
                      src={failedImageIds[item.id] ? ProductPlaceholder : item.image}
                      alt={cardHeading}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw"
                      priority={groupIndex < 4}
                      className="object-cover"
                      {...blurPlaceholderProps(failedImageIds[item.id] ? ProductPlaceholder : item.image)}
                      onError={() =>
                        setFailedImageIds((prev) => ({
                          ...prev,
                          [item.id]: true,
                        }))
                      }
                    />
                  </div>
                )}
                {showGallery ? (
                  <>
                    <button
                      type="button"
                      disabled={atStart}
                      onClick={bumpSlide(-1)}
                      className={twMerge(
                        'absolute left-2 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white-water/90 text-moss-green-200 shadow-md transition-all duration-200 ease-out',
                        atStart
                          ? 'cursor-not-allowed opacity-35'
                          : 'cursor-pointer hover:bg-white-water hover:shadow-lg active:scale-95',
                      )}
                      aria-label="Previous variant"
                    >
                      <ChevronLeftIcon className="size-6" />
                    </button>
                    <button
                      type="button"
                      disabled={atEnd}
                      onClick={bumpSlide(1)}
                      className={twMerge(
                        'absolute right-2 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white-water/90 text-moss-green-200 shadow-md transition-all duration-200 ease-out',
                        atEnd
                          ? 'cursor-not-allowed opacity-35'
                          : 'cursor-pointer hover:bg-white-water hover:shadow-lg active:scale-95',
                      )}
                      aria-label="Next variant"
                    >
                      <ChevronRightIcon className="size-6" />
                    </button>
                  </>
                ) : null}
              </div>
              <div
                key={item.id}
                className="flex min-h-0 flex-1 animate-shop-variant-copy flex-col gap-3 p-4"
              >
                <div className="flex shrink-0 flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-moss-green-200">{cardHeading}</h3>
                    {item.category ? (
                      <span
                        data-tooltip-id={showTooltips ? 'shop-category' : undefined}
                        data-tooltip-content={showTooltips ? item.category : undefined}
                        aria-label={item.category}
                        className="inline-flex items-center justify-center"
                        style={{ color: item.categoryColor || '#928E43', opacity: 0.92 }}
                      >
                        {categoryIcon(item.category)}
                      </span>
                    ) : null}
                  </div>
                </div>
                <p className="min-h-0 flex-1 text-base leading-relaxed opacity-90">{item.description}</p>
                <div className="flex shrink-0 items-center justify-between gap-3">
                  <p className="min-w-0 flex-1 text-base font-semibold text-moss-green-200">
                    {formatProductPriceDisplay(item)}
                  </p>
                  <button
                    type="button"
                    data-tooltip-id={showTooltips ? 'shop-add-cart' : undefined}
                    data-tooltip-content={showTooltips ? 'Add to cart' : undefined}
                    onClick={(event) => {
                      event.stopPropagation();
                      addToCart({
                        productId: item.id,
                        name: cardHeading,
                        packLabel: packLabelFromSpec(item.quantitySpec),
                        unitPriceIdr: item.price,
                      });
                    }}
                    className="cta before:bg-moss-green-100 shrink-0 flex size-10 cursor-pointer items-center justify-center !rounded-full bg-moss-green-200 text-white-water shadow-md"
                    aria-label={`Add ${cardHeading} to cart`}
                  >
                    <PlusIcon className="z-10 size-6" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${displayNameForCart(modalItem || selectedItem)} details`}
          onClick={closeProductModal}
        >
          <div
            className="relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white-water shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeProductModal}
              className="absolute right-3 top-3 z-20 cursor-pointer rounded-full bg-white-water/90 p-2 text-moss-green-200 shadow hover:bg-white-water"
              aria-label="Close"
            >
              <XMarkIcon className="size-5" />
            </button>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="relative h-56 w-full overflow-hidden bg-moss-green-100/15 md:h-80 lg:h-96">
                <div
                  key={(modalItem || selectedItem).id}
                  className="absolute inset-0 will-change-transform animate-shop-variant-from-right"
                >
                  <Image
                    src={
                      failedImageIds[(modalItem || selectedItem).id]
                        ? ProductPlaceholder
                        : ((modalItem?.image || selectedItem.image) as string | StaticImageData)
                    }
                    alt={displayNameForCart(modalItem || selectedItem)}
                    fill
                    sizes="(max-width: 767px) 100vw, 768px"
                    className="object-cover"
                    {...blurPlaceholderProps(
                      failedImageIds[(modalItem || selectedItem).id]
                        ? ProductPlaceholder
                        : ((modalItem?.image || selectedItem.image) as string | StaticImageData),
                    )}
                    onError={() =>
                      setFailedImageIds((prev) => ({
                        ...prev,
                        [(modalItem || selectedItem).id]: true,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="p-6 pb-10">
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-moss-green-200 md:text-4xl">
                    {displayNameForCart(modalItem || selectedItem)}
                  </h3>
                  <p className="mt-1 text-lg font-semibold text-moss-green-200">
                    {formatProductPriceDisplay(modalItem || selectedItem)}
                  </p>
                </div>
                {isLoadingDetail ? (
                  <p className="text-black-sand/70">Loading description...</p>
                ) : detailBlocks.length > 0 ? (
                  <div className="notion-content">
                    <RenderNotion blocks={detailBlocks} />
                  </div>
                ) : (
                  <p className="whitespace-pre-line text-base leading-relaxed text-black-sand">
                    {(modalItem?.description || selectedItem.description)}
                  </p>
                )}
                {detailError ? (
                  <p className="mt-3 text-sm text-red-700">{detailError}</p>
                ) : null}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-moss-green-300/30 px-4 pb-4 pt-5">
              <button
                type="button"
                onClick={closeProductModal}
                className="cursor-pointer rounded-md border border-moss-green-300 px-3 py-1 text-sm text-moss-green-200 hover:border-moss-green-200"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() =>
                  addToCart({
                    productId: (modalItem || selectedItem).id,
                    name: displayNameForCart(modalItem || selectedItem),
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
