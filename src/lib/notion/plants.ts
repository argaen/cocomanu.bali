import { cache } from 'react';
import type { BlockObjectResponse, DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { notion } from './client';
import { COLOR_MAP, DATABASES } from './constants';
import { fetchBlocksRecursively } from './page-blocks';
import type {
  FilesProperty,
  FormulaProperty,
  MultiSelectProperty,
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

export const getPlantBySlug = cache(async (slug: string): Promise<Plant | null> => {
  if (!DATABASES.plants) {
    return null;
  }

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
    return null;
  }

  return pageToPlant(response.results[0] as DatabaseObjectResponse);
});

export async function getPlantDetail(
  slug: string,
): Promise<{ plant: Plant; blocks: BlockObjectResponse[] } | null> {
  if (!DATABASES.plants) {
    return null;
  }

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
    return null;
  }

  const page = response.results[0] as DatabaseObjectResponse;
  const blocks = await withNotionRetry(() => fetchBlocksRecursively(page.id));

  return {
    plant: pageToPlant(page),
    blocks,
  };
}

function firstPlantPhotoUrl(filesProperty: unknown): string {
  if (!filesProperty || typeof filesProperty !== 'object') return '';
  const files = (filesProperty as FilesProperty).files;
  if (!Array.isArray(files) || files.length === 0) return '';
  const first = files[0] as { external?: { url: string }; file?: { url: string } };
  return first.external?.url ?? first.file?.url ?? '';
}

function pageToPlant(page: DatabaseObjectResponse): Plant {
  const layer = (page.properties.Layer as unknown as SelectProperty).select!;

  return {
    id: page.id,
    name: (page.properties.Name as unknown as TitleProperty).title[0].plain_text,
    image: firstPlantPhotoUrl(page.properties.Photo),
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
