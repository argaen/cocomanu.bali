import Image from 'next/image';
import Link from 'next/link';

import PlantPlaceholder from '@/assets/images/plant_placeholder.jpg';
import type { Plant } from '@/lib/notion';
import {twMerge} from 'tailwind-merge';

export type PlantCollectionProps = {
  plants: Plant[],
  containerClassName?: string,
  itemClassName?: string,
};

export function PlantCollection({
  plants,
  containerClassName = '',
  itemClassName = '',
}: PlantCollectionProps) {
  return (
    <div
      className={twMerge('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 pb-10', containerClassName)}
    >
      {plants.map((plant) => (
        <Link
          key={plant.name} href={`/garden/plants/${plant.slug}`}
          className={twMerge('shadow-md hover:shadow-lg transition-shadow duration-100', itemClassName)}

        >
          <div className="flex flex-col md:flex-row bg-white-water rounded-md space-y-2">
            <div className="relative w-full md:w-2/5 h-36">
              <Image
                alt={plant.name}
                src={plant.image || PlantPlaceholder}
                fill
                className="rounded-md object-cover"
                priority
              />
            </div>
            <div
              className="flex-1 p-2 pt-0 flex flex-col bg-opacity-15"
            >
              <div>
                <h2 className="text-xl text-moss-green-200">
                  {plant.name}
                </h2>
                <h3 className="text-sm italic opacity-50 text-black-sand">
                  {plant.scientific}
                </h3>
              </div>
              <div className="flex flex-wrap gap-1 mt-auto pt-2">
                {plant.uses.map(u => {
                  return (
                    <span
                      key={u.id}
                      className="block text-xs w-fit p-1 mb-1 rounded-md text-white-water"
                      style={{ backgroundColor: u.color }}
                    >
                      {`#${u.name}`}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
