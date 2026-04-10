'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';

import SearchBox from '@/components/SearchBox';
import { PlantCollection } from '@/components/PlantCollection';

import type { Plant } from '@/lib/notion';

/** Must match Notion “Uses” multi-select option names (comparison is normalized). */
export const PLANT_TAG_FILTERS = [
  'Spice/herb',
  'Edible',
  'Medicinal',
  'Biomass',
  'NFT',
  'Decorative',
] as const;

function normalizePlantTag(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s*\/\s*/g, '/')
    .replace(/\s+/g, ' ');
}

function plantHasUseTag(plant: Plant, filterLabel: string): boolean {
  const target = normalizePlantTag(filterLabel);
  return plant.uses.some((u) => normalizePlantTag(u.name) === target);
}

type PlantsSectionProps = {
  plants: Plant[];
};

function PlantsSectionInner({ plants }: PlantsSectionProps) {
  const searchParams = useSearchParams();
  const urlPlantSlug = searchParams.get('plant');

  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string>('All');

  const tagOptions = useMemo(
    () => ['All', ...PLANT_TAG_FILTERS] as const,
    [],
  );

  const filteredPlants = useMemo(
    () =>
      plants.filter((plant) => {
        const q = query.trim().toLowerCase();
        const matchName =
          !q
          || plant.name.toLowerCase().includes(q)
          || (plant.scientific && plant.scientific.toLowerCase().includes(q));
        const matchTag =
          activeTag === 'All' || plantHasUseTag(plant, activeTag);
        return matchName && matchTag;
      }),
    [plants, query, activeTag],
  );

  const deepLinkMatch =
    Boolean(urlPlantSlug) && plants.some((p) => p.slug === urlPlantSlug);

  const showPlantArea = filteredPlants.length > 0 || deepLinkMatch;

  return (
    <div>
      <div className="mx-auto mt-6 w-full max-w-5xl rounded-xl border border-moss-green-300/40 bg-white-water/80 p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <SearchBox
            value={query}
            onChange={setQuery}
            className="w-full md:flex-1"
            inputId="search-plants"
            srLabel="Search plants by name or scientific name"
            placeholder="Search by name or scientific name..."
          />
          <div className="w-full md:w-72">
            <Listbox value={activeTag} onChange={setActiveTag}>
              <div className="relative">
                <Listbox.Button className="w-full rounded-md border border-moss-green-300 bg-white-water px-4 py-3 pr-10 text-left text-base font-medium text-moss-green-200 outline-none transition-colors hover:border-moss-green-200 focus:border-moss-green-200 focus:ring-2 focus:ring-moss-green-200/25">
                  {activeTag === 'All' ? 'All tags' : activeTag}
                  <ChevronUpDownIcon
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-moss-green-200/80"
                  />
                </Listbox.Button>
                <Listbox.Options className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-md border border-moss-green-300/60 bg-white-water py-1 shadow-lg focus:outline-none">
                  {tagOptions.map((tag) => (
                    <Listbox.Option
                      key={tag}
                      value={tag}
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
                      {tag === 'All' ? 'All tags' : tag}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>
        </div>
      </div>

      {showPlantArea ? (
        <PlantCollection
          plants={filteredPlants}
          catalogPlants={plants}
          useModal
        />
      ) : (
        <p className="pt-10 pb-10 text-center text-black-sand">No plants found.</p>
      )}
    </div>
  );
}

export default function PlantsSection(props: PlantsSectionProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto mt-6 w-full max-w-5xl rounded-xl border border-moss-green-300/40 bg-white-water/80 p-8 text-center text-black-sand/70 shadow-sm">
          Loading plants…
        </div>
      }
    >
      <PlantsSectionInner {...props} />
    </Suspense>
  );
}
