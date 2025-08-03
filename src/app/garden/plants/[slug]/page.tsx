import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';

import '@/app/notion.css';
import { getPlant, getPlants, getPrices } from '@/lib/notion';
import NotionArticle from '@/components/notion/NotionArticle';

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
}: { params: Promise<{ slug: string }> }): Promise<React.JSX.Element> {
  const { slug } = await params;
  const { plant, blocks } = await getPlant(slug);
  const prices = await getPrices(plant.slug);

  return (
    <NotionArticle
      title={plant.name}
      subtitle={<span className="italic">{plant.scientific}</span>}
      image={plant.image}
      content={blocks}
      tags={[...plant.uses, plant.layer]}
      extraInfo={
        <div>
          <h3 className="uppercase tracking-wide mb-1 text-moss-green-200">
            Inventory
          </h3>
          {
            prices.length === 0 
            && (
              <span className="text-sm">
                No inventory available right now but
                we have it in our garden so we may be able to provide
                cuttings or seeds.
              </span>
            )
          }
          <ul className="list-disc pl-4 pb-4">
            {
              prices.map(p => (
                <li key={p.name}>
                  {p.name}
                  :
                  {' '}
                  {
                    p.price.toLocaleString(
                      'en-US',
                      {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      }
                    )
                  }
                </li>
              ))
            }
          </ul>
          <div className="flex items-center">
            <Link
              href={`https://wa.me/6584080142?text="Hi Cocomanu! I'm%20interested%20in%20${plant.name}"`}
              className="cta bg-moss-green-200 before:bg-moss-green-100"
              aria-label="Contact us"
            >
              <span className="flex text-white-water items-center py-1 px-2 z-10">
                Whatsapp us
                <ArrowRightIcon className="size-4 ml-1 font-bold"/>
              </span>
            </Link>
          </div>
        </div>
      }
    />
  );
}
