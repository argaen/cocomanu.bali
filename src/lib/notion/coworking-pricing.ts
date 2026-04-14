import type { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { notion } from './client';
import { DATABASES } from './constants';
import type { CoworkingPricing, NumberProperty, RichTextProperty, TitleProperty } from './types';

export async function getCoworkingPricing(): Promise<CoworkingPricing[]> {
  const databaseId = (DATABASES as Record<string, string>)['cowork-pricing'];
  if (!databaseId) {
    console.warn('[getCoworkingPricing] Missing `DATABASES.cowork-pricing` id.');
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'Price',
          direction: 'ascending',
        },
      ],
    });

    const rows = response.results as DatabaseObjectResponse[];
    return rows.map(pageToCoworkingPricing);
  } catch (error) {
    const e = error as { code?: string; message?: string };
    console.warn(
      `[getCoworkingPricing] Failed query for database ${databaseId}: ${e.code ?? 'unknown'} - ${e.message ?? 'unknown error'}`,
    );
    return [];
  }
}

function pageToCoworkingPricing(page: DatabaseObjectResponse): CoworkingPricing {
  const includesText =
    ((page.properties.Includes as unknown) as RichTextProperty).rich_text
      ?.map((r) => r.plain_text)
      .join('\n')
      .trim() ?? '';

  const includes = includesText
    .split(/\r?\n|,/)
    .map((s) => s.replace(/^[•\-\s]+/, '').trim())
    .filter(Boolean);

  return {
    id: page.id,
    name: ((page.properties.Name as unknown) as TitleProperty).title?.[0]?.plain_text ?? '',
    price: ((page.properties.Price as unknown) as NumberProperty).number ?? 0,
    dailyPrice:
      ((page.properties['Daily Price'] as unknown) as { formula?: { number?: number | null } })
        .formula?.number ?? 0,
    includes,
  };
}
