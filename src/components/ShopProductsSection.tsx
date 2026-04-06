'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';

import SearchBox from '@/components/SearchBox';
import ShopCollection from '@/components/ShopCollection';

import type { ShopItem } from '@/components/ShopCollection';

type ShopProductsSectionProps = {
  items: ShopItem[];
};

function ShopProductsSectionInner({ items }: ShopProductsSectionProps) {
  const searchParams = useSearchParams();
  const urlProductSlug = searchParams.get('product');

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(items.map((item) => item.category).filter(Boolean))).sort()],
    [items],
  );

  const filteredItems = useMemo(
    () => items.filter((item) => {
      const matchName = item.name.toLowerCase().includes(query.trim().toLowerCase());
      const matchCategory = activeCategory === 'All' || item.category === activeCategory;
      return matchName && matchCategory;
    }),
    [items, query, activeCategory],
  );

  const deepLinkMatch =
    Boolean(urlProductSlug) && items.some((i) => i.slug === urlProductSlug);

  const showProductArea = filteredItems.length > 0 || deepLinkMatch;

  return (
    <div>
      <div className="mx-auto mt-6 w-full max-w-5xl rounded-xl border border-moss-green-300/40 bg-white-water/80 p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <SearchBox
            value={query}
            onChange={setQuery}
            className="w-full md:flex-1"
            placeholder="Search products by name..."
          />
          <div className="w-full md:w-72">
            <Listbox value={activeCategory} onChange={setActiveCategory}>
              <div className="relative">
                <Listbox.Button className="w-full rounded-md border border-moss-green-300 bg-white-water px-4 py-3 pr-10 text-left text-base font-medium text-moss-green-200 outline-none transition-colors hover:border-moss-green-200 focus:border-moss-green-200 focus:ring-2 focus:ring-moss-green-200/25">
                  {activeCategory}
                  <ChevronUpDownIcon
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-moss-green-200/80"
                  />
                </Listbox.Button>
                <Listbox.Options className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-md border border-moss-green-300/60 bg-white-water py-1 shadow-lg focus:outline-none">
                  {categories.map((category) => (
                    <Listbox.Option
                      key={category}
                      value={category}
                      className={({ active, selected }) =>
                        `cursor-pointer px-4 py-2 text-base ${
                          selected
                            ? 'bg-moss-green-200 text-white-water'
                            : active
                              ? 'bg-moss-green-100/20 text-moss-green-200'
                              : 'text-black-sand'
                        }`
                      }
                    >
                      {category}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>
        </div>
      </div>

      {showProductArea ? (
        <ShopCollection items={filteredItems} catalogItems={items} />
      ) : (
        <p className="text-center pt-10 pb-10">No products found.</p>
      )}
    </div>
  );
}

export default function ShopProductsSection(props: ShopProductsSectionProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto mt-6 w-full max-w-5xl rounded-xl border border-moss-green-300/40 bg-white-water/80 p-8 text-center text-black-sand/70 shadow-sm">
          Loading shop…
        </div>
      }
    >
      <ShopProductsSectionInner {...props} />
    </Suspense>
  );
}
