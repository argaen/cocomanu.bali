import React from 'react';

import { getPlants } from '@/lib/notion';
import { PlantCollection } from '@/components/PlantCollection';

export default async function PlantsPage() {
  const plants = await getPlants();

  return (
    <div>
      <div>
        <h1 className="text-moss-green-200">
          Plants
        </h1>
        <p className="text-black-sand text-md">
          This is our collection of plants and trees that you can find in Cocomanu. Explore in our garden and feel free to ask our staff if you are interested on any of them!
        </p>
      </div>
      <PlantCollection plants={plants} />
    </div>
  );
}
