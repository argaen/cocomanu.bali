import type { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { cafeMenuImageSlug, resolveLocalCafeImage } from '@/lib/cafe-images';
import { notion } from './client';
import { COLOR_MAP, DATABASES } from './constants';
import type {
  CafeMenuItem,
  MultiSelectProperty,
  NumberProperty,
  RichTextProperty,
  SelectProperty,
  TitleProperty,
} from './types';

export async function getCafeMenu(): Promise<CafeMenuItem[]> {
  const databaseId = DATABASES['cafe-menu'];
  if (!databaseId) {
    console.warn('[getCafeMenu] Missing `DATABASES.cafe-menu` id.');
    return [];
  }

  try {
    const rows: DatabaseObjectResponse[] = [];
    let cursor: string | undefined;

    do {
      const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
          property: 'Availability',
          status: {
            equals: 'Available',
          },
        },
        sorts: [
          { property: 'Category', direction: 'ascending' },
          { property: 'Item Name', direction: 'ascending' },
        ],
        start_cursor: cursor,
        page_size: 100,
      });
      rows.push(...(response.results as DatabaseObjectResponse[]));
      cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
    } while (cursor);

    return rows.map(pageToCafeMenuItem).filter((item) => item.name.length > 0);
  } catch (error) {
    const e = error as { code?: string; message?: string };
    console.warn(
      `[getCafeMenu] Failed query for database ${databaseId}: ${e.code ?? 'unknown'} - ${e.message ?? 'unknown error'}`,
    );
    return [];
  }
}

function pageToCafeMenuItem(page: DatabaseObjectResponse): CafeMenuItem {
  const properties = page.properties as Record<string, unknown>;
  const name = titleFromProperty(properties['Item Name']).trim();
  const slug = cafeMenuImageSlug(name, page.id);

  return {
    id: page.id,
    name,
    description: richTextFromProperty(properties.Description),
    price: numberFromProperty(properties['Sale Price']),
    image: resolveLocalCafeImage(slug),
    category: selectNameFromProperty(properties.Category),
    slug,
    healthTags: healthTagsFromProperty(
      properties['Health tags'] ?? properties['Health Tags'],
    ),
  };
}

function titleFromProperty(property: unknown): string {
  if (!property || typeof property !== 'object') return '';
  const title = (property as TitleProperty).title;
  if (!Array.isArray(title)) return '';
  return title.map((t) => t.plain_text).join('');
}

function richTextFromProperty(property: unknown): string {
  if (!property || typeof property !== 'object') return '';
  const richText = (property as RichTextProperty).rich_text;
  if (!Array.isArray(richText)) return '';
  return richText.map((t) => t.plain_text).join('').trim();
}

function numberFromProperty(property: unknown): number {
  if (!property || typeof property !== 'object') return 0;
  const value = (property as NumberProperty).number;
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function selectNameFromProperty(property: unknown): string {
  if (!property || typeof property !== 'object') return '';
  return (property as SelectProperty).select?.name?.trim() ?? '';
}

function healthTagsFromProperty(property: unknown): CafeMenuItem['healthTags'] {
  if (!property || typeof property !== 'object') return [];
  const tags = (property as MultiSelectProperty).multi_select;
  if (!Array.isArray(tags)) return [];
  return tags
    .map((tag) => {
      const name = tag.name.trim();
      if (!name) return null;
      return {
        name,
        color: COLOR_MAP[tag.color] || COLOR_MAP.default,
      };
    })
    .filter((tag): tag is CafeMenuItem['healthTags'][number] => tag !== null);
}
