import { notFound } from 'next/navigation';
import type { NotionBlock } from '@9gustin/react-notion-render';
import type { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { notion } from './client';
import { COLOR_MAP, DATABASES } from './constants';
import type {
  FilesProperty,
  FormulaProperty,
  MultiSelectProperty,
  NumberProperty,
  Plant,
  RichTextProperty,
  SelectProperty,
  TitleProperty,
} from './types';

type GetPlantsProps = {
  limit?: number;
};

export async function getPlants({
  limit,
}: GetPlantsProps = {}): Promise<Plant[]> {
  const response = await notion.databases.query({
    database_id: DATABASES.plants,
    sorts: [
      {
        property: 'Name',
        direction: 'ascending',
      },
    ],
    filter: {
      property: 'Available',
      checkbox: {
        equals: true,
      },
    },
    page_size: limit,
  });
  const results = response.results as DatabaseObjectResponse[];

  return results.map((page) => pageToPlant(page));
}

export async function getPlant(slug: string): Promise<{ plant: Plant; blocks: NotionBlock[] }> {
  const response = await notion.databases.query({
    database_id: DATABASES.plants,
    filter: {
      property: 'Slug',
      rich_text: {
        equals: slug,
      },
    },
  });

  if (!response.results.length) {
    notFound();
  }

  const page = response.results[0];
  const blocks = await notion.blocks.children.list({ block_id: page.id });

  return {
    plant: pageToPlant(page as DatabaseObjectResponse),
    blocks: blocks.results as NotionBlock[],
  };
}

export async function getPrices(id: string) {
  const response = await notion.databases.query({
    database_id: DATABASES.prices,
    sorts: [
      {
        property: 'Price',
        direction: 'ascending',
      },
    ],
    filter: {
      property: 'Id',
      title: {
        equals: id,
      },
    },
  });
  const results = response.results as DatabaseObjectResponse[];

  return results.map((page) => pageToPrice(page));
}

function pageToPlant(page: DatabaseObjectResponse): Plant {
  const layer = (page.properties.Layer as unknown as SelectProperty).select!;

  return {
    id: page.id,
    name: (page.properties.Name as unknown as TitleProperty).title[0].plain_text,
    image: (page.properties.Photo as unknown as FilesProperty).files[0]?.external.url,
    layer: {
      ...layer,
      color: COLOR_MAP[layer.color],
    },
    uses: (page.properties.Uses as unknown as MultiSelectProperty).multi_select.map((o) => ({
      ...o,
      color: COLOR_MAP[o.color] || o.color,
    })),
    scientific: (page.properties['Scientific Name'] as unknown as RichTextProperty).rich_text[0]?.plain_text,
    slug: (page.properties.Slug as unknown as FormulaProperty).formula.string,
  };
}

function pageToPrice(page: DatabaseObjectResponse) {
  return {
    name: (page.properties.Name as unknown as RichTextProperty).rich_text[0].plain_text,
    price: (page.properties.Price as unknown as NumberProperty).number,
  };
}
