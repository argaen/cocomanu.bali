import type { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { notion } from './client';
import { DATABASES } from './constants';
import type { ColivePricing, NumberProperty, RichTextProperty, TitleProperty } from './types';

export async function getColivePricing(): Promise<ColivePricing[]> {
  const databaseId = (DATABASES as Record<string, string>)['colive-pricing'];
  if (!databaseId) {
    console.warn('[getColivePricing] Missing `DATABASES.colive-pricing` id.');
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
    return rows.map(pageToColivePricing);
  } catch (error) {
    const e = error as { code?: string; message?: string };
    console.warn(
      `[getColivePricing] Failed query for database ${databaseId}: ${e.code ?? 'unknown'} - ${e.message ?? 'unknown error'}`,
    );
    return [];
  }
}

function pageToColivePricing(page: DatabaseObjectResponse): ColivePricing {
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
      ((page.properties['Nightly Rate'] as unknown) as { formula?: { number?: number | null } })
        .formula?.number ?? 0,
    minimumLength: numberFromProperty(page.properties['Minimum Length'])
      || numberFromProperty(page.properties.Validity),
    includes,
  };
}

function numberFromProperty(property: unknown): number {
  if (!property || typeof property !== 'object') return 0;
  const maybeNumber = (property as NumberProperty).number;
  if (typeof maybeNumber === 'number' && Number.isFinite(maybeNumber)) {
    return maybeNumber;
  }
  const maybeFormula = (property as { formula?: { number?: number | null } }).formula?.number;
  if (typeof maybeFormula === 'number' && Number.isFinite(maybeFormula)) {
    return maybeFormula;
  }
  return 0;
}
