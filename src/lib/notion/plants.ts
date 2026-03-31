import { notFound } from 'next/navigation';
import { cache } from 'react';
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

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function shouldRetryNotionError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  const maybeError = error as {
    code?: string;
    status?: number;
    cause?: { code?: string };
  };

  const code = maybeError.code ?? maybeError.cause?.code ?? '';
  const status = maybeError.status ?? 0;

  return (
    code === 'ECONNRESET' ||
    code === 'ETIMEDOUT' ||
    code === 'UND_ERR_CONNECT_TIMEOUT' ||
    code === 'UND_ERR_HEADERS_TIMEOUT' ||
    code === 'UND_ERR_SOCKET' ||
    status === 429 ||
    status >= 500
  );
}

async function withNotionRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let attempt = 0;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= maxRetries || !shouldRetryNotionError(error)) {
        throw error;
      }
      const delayMs = 400 * 2 ** attempt;
      attempt += 1;
      await sleep(delayMs);
    }
  }
}

export async function getPlants({
  limit,
}: GetPlantsProps = {}): Promise<Plant[]> {
  const all: DatabaseObjectResponse[] = [];
  let startCursor: string | undefined;

  while (true) {
    const pageSize = limit != null ? Math.min(100, Math.max(limit - all.length, 1)) : 100;
    const response = await withNotionRetry(() =>
      notion.databases.query({
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
        page_size: pageSize,
        start_cursor: startCursor,
      }),
    );

    const batch = response.results as DatabaseObjectResponse[];
    all.push(...batch);

    if (limit != null && all.length >= limit) {
      return all.slice(0, limit).map((page) => pageToPlant(page));
    }
    if (!response.has_more || !response.next_cursor) {
      break;
    }
    startCursor = response.next_cursor;
  }

  return all.map((page) => pageToPlant(page));
}

export const getPlant = cache(async (slug: string): Promise<{ plant: Plant; blocks: NotionBlock[] }> => {
  const response = await withNotionRetry(() =>
    notion.databases.query({
      database_id: DATABASES.plants,
      filter: {
        property: 'Slug',
        rich_text: {
          equals: slug,
        },
      },
    }),
  );

  if (!response.results.length) {
    notFound();
  }

  const page = response.results[0];
  const blocks = await withNotionRetry(() =>
    notion.blocks.children.list({ block_id: page.id }),
  );

  return {
    plant: pageToPlant(page as DatabaseObjectResponse),
    blocks: blocks.results as NotionBlock[],
  };
});

export async function getPrices(id: string) {
  const response = await withNotionRetry(() =>
    notion.databases.query({
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
    }),
  );
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
