'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { StaticImageData } from 'next/image';
import type { NotionBlock } from '@9gustin/react-notion-render';
import { twMerge } from 'tailwind-merge';
import { XMarkIcon } from '@heroicons/react/24/outline';

import RenderNotion from '@/components/notion/RenderNotion';
import PlantPlaceholder from '@/assets/images/product_placeholder.webp';
import type { Plant } from '@/lib/notion';

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

export type PlantCollectionProps = {
  plants: Plant[];
  /** Full list for `?plant=` deep links when the grid is filtered (modal mode only). */
  catalogPlants?: Plant[];
  /** When true (default), open Notion content in a modal and sync `?plant=` on `/garden/plants`. */
  useModal?: boolean;
  containerClassName?: string;
  itemClassName?: string;
};

export function PlantCollection({
  plants,
  catalogPlants: catalogPlantsProp,
  useModal = true,
  containerClassName = '',
  itemClassName = '',
}: PlantCollectionProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPlantSlug = useModal ? searchParams.get('plant') : null;

  const catalogPlants = catalogPlantsProp ?? plants;
  const closedSlugRef = useRef<string | null>(null);
  const pendingSlugInUrlRef = useRef<string | null>(null);

  const [failedImageIds, setFailedImageIds] = useState<Record<string, true>>({});
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [modalPlant, setModalPlant] = useState<Plant | null>(null);
  const [detailBlocks, setDetailBlocks] = useState<NotionBlock[]>([]);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState('');

  useEffect(() => {
    if (!selectedPlant || !useModal) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedPlant, useModal]);

  const syncPlantUrl = useCallback(
    (slug: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (slug) {
        params.set('plant', slug);
      } else {
        params.delete('plant');
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const closePlantModal = useCallback(() => {
    if (selectedPlant?.slug) {
      closedSlugRef.current = selectedPlant.slug;
    }
    pendingSlugInUrlRef.current = null;
    syncPlantUrl(null);
    setSelectedPlant(null);
    setModalPlant(null);
    setDetailBlocks([]);
    setDetailError('');
    setIsLoadingDetail(false);
  }, [syncPlantUrl, selectedPlant?.slug]);

  useEffect(() => {
    if (!selectedPlant || !useModal) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePlantModal();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [selectedPlant, closePlantModal, useModal]);

  const openPlantDetail = useCallback(
    async (plant: Plant) => {
      closedSlugRef.current = null;
      pendingSlugInUrlRef.current = plant.slug;
      syncPlantUrl(plant.slug);
      setSelectedPlant(plant);
      setDetailError('');
      setDetailBlocks([]);
      setModalPlant(null);
      setIsLoadingDetail(true);

      try {
        const response = await fetch(`/api/plants/by-slug/${encodeURIComponent(plant.slug)}`);
        if (!response.ok) {
          throw new Error('Request failed');
        }
        const data = (await response.json()) as {
          plant?: Plant;
          blocks?: NotionBlock[];
        };
        if (data.plant) {
          setModalPlant(data.plant);
        } else {
          setModalPlant(plant);
        }
        setDetailBlocks(Array.isArray(data.blocks) ? data.blocks : []);
      } catch {
        setDetailError('Unable to load plant details right now.');
        setModalPlant(plant);
      } finally {
        setIsLoadingDetail(false);
      }
    },
    [syncPlantUrl],
  );

  useEffect(() => {
    if (!useModal) {
      return;
    }
    if (urlPlantSlug) {
      pendingSlugInUrlRef.current = null;
    }
  }, [useModal, urlPlantSlug]);

  useEffect(() => {
    if (!useModal) {
      return;
    }

    if (!urlPlantSlug) {
      if (pendingSlugInUrlRef.current) {
        return;
      }
      if (selectedPlant) {
        setSelectedPlant(null);
        setModalPlant(null);
        setDetailBlocks([]);
        setDetailError('');
        setIsLoadingDetail(false);
      }
      closedSlugRef.current = null;
      return;
    }

    if (catalogPlants.length === 0) {
      closedSlugRef.current = null;
      return;
    }
    if (closedSlugRef.current === urlPlantSlug) {
      return;
    }
    if (selectedPlant?.slug === urlPlantSlug) {
      return;
    }
    const match = catalogPlants.find((p) => p.slug === urlPlantSlug);
    if (!match) {
      return;
    }
    void openPlantDetail(match);
  }, [useModal, urlPlantSlug, catalogPlants, selectedPlant, openPlantDetail]);

  const displayPlant = modalPlant || selectedPlant;

  function plantTags(plant: Plant) {
    return [...plant.uses, plant.layer];
  }

  return (
    <>
      <div
        className={twMerge(
          'grid grid-cols-1 gap-6 pt-6 pb-10 md:grid-cols-2 lg:grid-cols-4',
          containerClassName,
        )}
      >
        {plants.map((plant, index) => {
          const imageSrc = failedImageIds[plant.id] ? PlantPlaceholder : (plant.image || PlantPlaceholder);
          if (!useModal) {
            const queryHref = `/garden/plants?plant=${encodeURIComponent(plant.slug)}`;

            return (
              <Link
                key={plant.id}
                href={queryHref}
                className={twMerge(
                  'group flex h-full flex-col overflow-hidden rounded-md bg-white-water text-black-sand shadow-md transition-shadow hover:shadow-lg',
                  itemClassName,
                )}
              >
                <article className="flex h-full flex-col">
                  <div className="relative h-52 w-full shrink-0 overflow-hidden bg-moss-green-100/15">
                    <Image
                      alt={plant.name}
                      src={imageSrc}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw"
                      priority={index < 4}
                      className="object-cover transition-opacity duration-300 group-hover:opacity-95"
                      {...blurPlaceholderProps(imageSrc)}
                      onError={() =>
                        setFailedImageIds((prev) => ({
                          ...prev,
                          [plant.id]: true,
                        }))
                      }
                    />
                  </div>
                  <div className="flex min-h-0 flex-1 flex-col gap-2 p-4">
                    <div className="shrink-0">
                      <h3 className="text-xl font-bold text-moss-green-200">{plant.name}</h3>
                      {plant.scientific ? (
                        <p className="mt-0.5 text-sm italic leading-snug text-black-sand/70">
                          {plant.scientific}
                        </p>
                      ) : null}
                    </div>
                    {plant.uses.length > 0 ? (
                      <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                        {plant.uses.map((u) => (
                          <span
                            key={u.id}
                            className="rounded-md px-2 py-0.5 text-xs font-medium text-white-water"
                            style={{ backgroundColor: u.color }}
                          >
                            {u.name}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              </Link>
            );
          }

          return (
            <article
              key={plant.id}
              role="button"
              tabIndex={0}
              onClick={() => {
                void openPlantDetail(plant);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  void openPlantDetail(plant);
                }
              }}
              className={twMerge(
                'group flex h-full cursor-pointer flex-col overflow-hidden rounded-md bg-white-water text-black-sand shadow-md transition-shadow hover:shadow-lg',
                itemClassName,
              )}
            >
              <div className="relative h-52 w-full shrink-0 overflow-hidden bg-moss-green-100/15">
                <Image
                  alt={plant.name}
                  src={imageSrc}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw"
                  priority={index < 4}
                  className="object-cover transition-opacity duration-300 group-hover:opacity-95"
                  {...blurPlaceholderProps(imageSrc)}
                  onError={() =>
                    setFailedImageIds((prev) => ({
                      ...prev,
                      [plant.id]: true,
                    }))
                  }
                />
              </div>
              <div className="flex min-h-0 flex-1 flex-col gap-2 p-4">
                <div className="shrink-0">
                  <h3 className="text-xl font-bold text-moss-green-200">{plant.name}</h3>
                  {plant.scientific ? (
                    <p className="mt-0.5 text-sm italic leading-snug text-black-sand/70">
                      {plant.scientific}
                    </p>
                  ) : null}
                </div>
                {plant.uses.length > 0 ? (
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                    {plant.uses.map((u) => (
                      <span
                        key={u.id}
                        className="rounded-md px-2 py-0.5 text-xs font-medium text-white-water"
                        style={{ backgroundColor: u.color }}
                      >
                        {u.name}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      {useModal && selectedPlant && displayPlant && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedPlant.name} details`}
          onClick={closePlantModal}
        >
          <div
            className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white-water shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative h-56 w-full shrink-0 overflow-hidden bg-moss-green-100/15">
              <Image
                src={
                  failedImageIds[displayPlant.id]
                    ? PlantPlaceholder
                    : (displayPlant.image || PlantPlaceholder)
                }
                alt={displayPlant.name}
                fill
                sizes="(max-width: 767px) 100vw, 768px"
                className="object-cover transition-opacity duration-300"
                {...blurPlaceholderProps(
                  failedImageIds[displayPlant.id]
                    ? PlantPlaceholder
                    : (displayPlant.image || PlantPlaceholder),
                )}
                onError={() =>
                  setFailedImageIds((prev) => ({
                    ...prev,
                    [displayPlant.id]: true,
                  }))
                }
              />
              <button
                type="button"
                onClick={closePlantModal}
                className="absolute right-3 top-3 cursor-pointer rounded-full bg-white-water/90 p-2 text-moss-green-200 shadow hover:bg-white-water"
                aria-label="Close"
              >
                <XMarkIcon className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 pb-10">
              <div className="mb-6">
                <h3 className="text-3xl font-bold text-moss-green-200 md:text-4xl">{displayPlant.name}</h3>
                {displayPlant.scientific ? (
                  <p className="mt-1 text-lg italic text-black-sand/80">{displayPlant.scientific}</p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  {plantTags(displayPlant).map((t) => (
                    <span
                      key={t.id}
                      className="rounded-md px-2 py-0.5 text-xs font-medium text-white-water"
                      style={{ backgroundColor: t.color }}
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
              {isLoadingDetail ? (
                <p className="text-black-sand/70">Loading…</p>
              ) : detailBlocks.length > 0 ? (
                <div className="notion-content">
                  <RenderNotion blocks={detailBlocks} />
                </div>
              ) : (
                <p className="text-sm text-black-sand/70">No additional notes for this plant yet.</p>
              )}
              {detailError ? (
                <p className="mt-3 text-sm text-red-700">{detailError}</p>
              ) : null}
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-moss-green-300/30 px-4 pb-4 pt-5">
              <button
                type="button"
                onClick={closePlantModal}
                className="cursor-pointer rounded-md border border-moss-green-300 px-3 py-1 text-sm text-moss-green-200 hover:border-moss-green-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
