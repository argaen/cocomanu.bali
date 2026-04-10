import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getPlantBySlug, getPlants } from '@/lib/notion';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const plant = await getPlantBySlug(slug);

  if (!plant) {
    return {
      title: 'Plant',
      robots: { index: true },
    };
  }

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
  }));
}

export default async function PlantSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const plant = await getPlantBySlug(slug);

  if (!plant) {
    redirect('/garden/plants');
  }

  redirect(`/garden/plants?plant=${encodeURIComponent(slug)}`);
}
