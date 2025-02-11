import { indexGenerator, NotionBlock, rnrSlugify } from '@9gustin/react-notion-render'
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import '@/app/notion.css';
import { getPlant, getPlants } from '@/lib/notion';
import RenderNotion from '@/components/RenderNotion';

export async function generateMetadata({
  params
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { plant } = await getPlant(slug);

  return {
    title: plant.name,
    description: `${plant.name} in a tropical food forest`,
    keywords: `${plant.name}, ${plant.scientific}, tropical food forest, permaculture`,
    openGraph: {
      title: plant.name,
      description: `${plant.name} in a tropical food forest`,
      type: 'article',
    },
    robots: {
      index: true,
    },
  };
}

export async function generateStaticParams() {
  const plants = await getPlants();
 
  return plants.map((plant) => ({
    slug: plant.slug,
  }))
}

export default async function PlantPage({
  params,
}: { params: Promise<{ slug: string }> }): Promise<JSX.Element> {
  const { slug } = await params;
  const { plant, blocks } = await getPlant(slug);

  return (
    <div>
      <div className="pb-3 space-y-3">
        <div>
          <h1 className="text-2xl md:text-5xl lg:text-6xl text-moss-green-200">{plant.name}</h1>
          <h3 className="italic text-lg md:text-xl lg:text-2xl text-black-sand opacity-40">{plant.scientific}</h3>
        </div>
        <div className="md:hidden flex gap-2">
          {plant.uses.map(u => {
            return (
              <span
                key={u.id}
                className="block text-xs w-fit p-1 mb-1 rounded-md opacity-80 text-white-water"
                style={{ backgroundColor: u.color }}
              >
                {`#${u.name}`}
              </span>
            )
          })}
          <span
            key={plant.layer.name}
            className="block text-xs w-fit p-1 mb-1 rounded-md opacity-80 text-white-water"
            style={{ backgroundColor: plant.layer.color }}
          >
            {`#${plant.layer.name}`}
          </span>
        </div>
      </div>
      <div className="pb-6">
        <div className="flex gap-12 pb-3">
          <div className="md:w-4/5">
            <RenderNotion
              blocks={blocks as BlockObjectResponse[]}
            />
          </div>
          <div className="hidden md:block sticky top-40 w-1/5 h-fit text-base space-y-6 text-black-sand py-2">
            <div>
              <h3 className="uppercase tracking-wide mb-1 text-moss-green-200">
                Table of Contents
              </h3>
              <ul className="list-disc pl-4">
                {
                  indexGenerator(blocks as NotionBlock[]).map(({ id, plainText }) => (
                    <li key={id}>
                      <a href={`#${rnrSlugify(plainText)}`}>
                        {plainText}
                      </a>
                    </li>
                  ))
                }
              </ul>
            </div>
            <div>
              <h3 className="uppercase tracking-wide mb-1 text-moss-green-200">
                Layer
              </h3>
              <span
                key={plant.layer.name}
                className="block text-xs w-fit p-1 mb-1 rounded-md opacity-80 text-white-water"
                style={{ backgroundColor: plant.layer.color }}
              >
                {plant.layer.name}
              </span>
            </div>
            <div>
              <h3 className="uppercase tracking-wide mb-1 text-moss-green-200">
                Uses
              </h3>
              {plant.uses.map(u => {
                return (
                  <span
                    key={u.id}
                    className="block text-xs w-fit p-1 mb-1 rounded-md opacity-80 text-white-water"
                    style={{ backgroundColor: u.color }}
                  >
                    {`#${u.name}`}
                  </span>
                )
              })}
            </div>
            <Link href="/garden/plants" className="uppercase flex items-center text-moss-green-200">
              <ArrowLeftIcon className="w-4 mr-1"/>
              Back
            </Link>
          </div>
        </div>
        <Link href="/garden/plants" className="md:hidden uppercase w-full flex items-center text-moss-green-200">
          <ArrowLeftIcon className="w-4 mr-1"/>
          Back
        </Link>
      </div>
    </div>
  );
}
