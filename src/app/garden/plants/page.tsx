import type { Metadata } from 'next';

import PlantsSection from '@/components/PlantsSection';
import { getPlants } from '@/lib/notion';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Cocomanu - Garden plants',
  description:
    'Plants and trees in the Cocomanu garden — explore species, uses, and details.',
  keywords: ['garden', 'plants', 'permaculture', 'cocomanu'],
  robots: {
    index: true,
  },
};

export default async function PlantsPage() {
  const plants = await getPlants();

  return (
    <div className="pt-24 md:pt-28 lg:pt-32">
      <div className="px-6 text-black-sand md:px-10 lg:px-20">
        <PlantsSection plants={plants} />
      </div>
    </div>
  );
}
