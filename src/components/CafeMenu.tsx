'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

import ProductPlaceholder from '@/assets/images/product_placeholder.webp';
import SearchBox from '@/components/SearchBox';
import type { CafeMenuItem } from '@/lib/notion/types';
import { formatPriceNumberAsK } from '@/lib/notion';
import {
  blurPlaceholderProps,
  IMAGE_QUALITY_CARD,
  IMAGE_SIZES_GRID_CARD,
} from '@/lib/next-image';

export type CafeMenuProps = {
  items: CafeMenuItem[];
};

const CATEGORY_ORDER = ['Breakfast', 'Cafe Drinks', 'Sweets'];

function groupByCategory(items: CafeMenuItem[]): { category: string; items: CafeMenuItem[] }[] {
  const groups = new Map<string, CafeMenuItem[]>();

  for (const item of items) {
    const category = item.category.trim() || 'Other';
    const list = groups.get(category);
    if (list) list.push(item);
    else groups.set(category, [item]);
  }

  const known = CATEGORY_ORDER
    .filter((category) => groups.has(category))
    .map((category) => ({ category, items: groups.get(category) ?? [] }));

  const extra = [...groups.keys()]
    .filter((category) => !CATEGORY_ORDER.includes(category))
    .sort((a, b) => a.localeCompare(b))
    .map((category) => ({ category, items: groups.get(category) ?? [] }));

  return [...known, ...extra];
}

export default function CafeMenu({ items }: CafeMenuProps) {
  const [query, setQuery] = useState('');
  const [failedImageIds, setFailedImageIds] = useState<Record<string, true>>({});

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      return (
        item.name.toLowerCase().includes(q)
        || item.description.toLowerCase().includes(q)
        || item.category.toLowerCase().includes(q)
      );
    });
  }, [items, query]);

  const groupedItems = useMemo(() => groupByCategory(filteredItems), [filteredItems]);

  if (items.length === 0) {
    return (
      <p className="px-6 text-center text-white-water/80">
        The menu will be posted here soon.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
      <SearchBox
        value={query}
        onChange={setQuery}
        className="mx-auto mb-10 w-full max-w-xl"
        inputId="search-menu"
        srLabel="Search the cafe menu"
        placeholder="Search the menu..."
      />
      {filteredItems.length === 0 ? (
        <p className="text-center text-white-water/80">
          No menu items match that search.
        </p>
      ) : (
        <div className="space-y-12">
          {groupedItems.map((group) => (
            <section key={group.category} aria-labelledby={`menu-${group.category}`}>
              <h2
                id={`menu-${group.category}`}
                className="mb-6 !font-josefin !text-2xl font-semibold tracking-wide text-dawn-rays-200 md:!text-3xl"
              >
                {group.category}
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {group.items.map((item, index) => {
                  const imageSrc = failedImageIds[item.id]
                    ? ProductPlaceholder
                    : (item.image || ProductPlaceholder);

                  return (
                    <article
                      key={item.id}
                      className="flex h-full flex-col overflow-hidden rounded-md bg-white-water text-black-sand shadow-md"
                    >
                      <div className="relative h-52 w-full shrink-0 overflow-hidden bg-black-sand/10">
                        <Image
                          alt={item.name}
                          src={imageSrc}
                          fill
                          quality={IMAGE_QUALITY_CARD}
                          sizes={IMAGE_SIZES_GRID_CARD}
                          priority={index < 4}
                          className="object-cover"
                          {...blurPlaceholderProps(imageSrc)}
                          onError={() =>
                            setFailedImageIds((prev) => ({
                              ...prev,
                              [item.id]: true,
                            }))
                          }
                        />
                      </div>
                      <div className="flex min-h-0 flex-1 flex-col gap-2 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-xl font-bold text-black-sand">{item.name}</h3>
                          {item.price > 0 ? (
                            <span className="shrink-0 rounded-full bg-black-sand px-2.5 py-1 text-sm font-semibold text-white-water">
                              IDR {formatPriceNumberAsK(item.price)}
                            </span>
                          ) : null}
                        </div>
                        {item.description ? (
                          <p className="text-sm leading-relaxed text-black-sand/80 md:text-base">
                            {item.description}
                          </p>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
