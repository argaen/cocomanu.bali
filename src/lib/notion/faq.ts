import type { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { notion } from './client';
import { DATABASES } from './constants';
import type { FaqItem, NumberProperty, RichTextProperty, SelectProperty, TitleProperty } from './types';

/**
 * FAQs for a given site page (matches Notion `Page` select / multi-select).
 * Example: `getFaqsForPage('Colive')`.
 */
export async function getFaqsForPage(page: string): Promise<FaqItem[]> {
  const databaseId = DATABASES.faq;
  if (!databaseId) {
    console.warn('[getFaqsForPage] Missing `DATABASES.faq` id.');
    return [];
  }

  const pageKey = page.trim().toLowerCase();
  if (!pageKey) return [];

  try {
    const rows = await queryAllFaqRows(databaseId);
    return rows
      .map(pageToFaqItem)
      .filter((item) => item.question && item.answer)
      .filter((item) => item.pages.some((p) => p.trim().toLowerCase() === pageKey))
      .sort((a, b) => a.order - b.order || a.question.localeCompare(b.question));
  } catch (error) {
    const e = error as { code?: string; message?: string };
    console.warn(
      `[getFaqsForPage] Failed query for database ${databaseId}: ${e.code ?? 'unknown'} - ${e.message ?? 'unknown error'}`,
    );
    return [];
  }
}

async function queryAllFaqRows(databaseId: string): Promise<DatabaseObjectResponse[]> {
  const rows: DatabaseObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      page_size: 100,
      sorts: [
        {
          property: 'Order',
          direction: 'ascending',
        },
      ],
    });
    rows.push(...(response.results as DatabaseObjectResponse[]));
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return rows;
}

function pageToFaqItem(page: DatabaseObjectResponse): FaqItem {
  const properties = page.properties as Record<string, unknown>;

  return {
    id: page.id,
    question: titleFromProperties(properties),
    answer: richTextFromProperties(properties, ['Answer', 'Answers', 'Response', 'Content']),
    pages: pagesFromProperty(properties.Page ?? properties.page),
    order: numberFromProperty(properties.Order ?? properties.order),
  };
}

function titleFromProperties(properties: Record<string, unknown>): string {
  for (const key of ['Question', 'Name', 'Title', 'FAQ']) {
    const text = titleFromProperty(properties[key]);
    if (text) return text;
  }

  for (const value of Object.values(properties)) {
    const text = titleFromProperty(value);
    if (text) return text;
  }

  return '';
}

function titleFromProperty(property: unknown): string {
  if (!property || typeof property !== 'object') return '';
  const title = (property as TitleProperty).title;
  if (!Array.isArray(title)) return '';
  return title.map((t) => t.plain_text).join('').trim();
}

function richTextFromProperties(
  properties: Record<string, unknown>,
  preferredKeys: string[],
): string {
  for (const key of preferredKeys) {
    const text = richTextFromProperty(properties[key]);
    if (text) return text;
  }

  for (const [key, value] of Object.entries(properties)) {
    if (preferredKeys.some((k) => k.toLowerCase() === key.toLowerCase())) continue;
    if (key.toLowerCase() === 'page' || key.toLowerCase() === 'order') continue;
    const text = richTextFromProperty(value);
    if (text) return text;
  }

  return '';
}

function richTextFromProperty(property: unknown): string {
  if (!property || typeof property !== 'object') return '';
  const richText = (property as RichTextProperty).rich_text;
  if (!Array.isArray(richText)) return '';
  return richText.map((t) => t.plain_text).join('').trim();
}

function pagesFromProperty(property: unknown): string[] {
  if (!property || typeof property !== 'object') return [];

  const asSelect = property as SelectProperty & { type?: string };
  if (asSelect.select?.name) {
    return [asSelect.select.name];
  }

  const multi = (property as { multi_select?: { name: string }[] }).multi_select;
  if (Array.isArray(multi)) {
    return multi.map((o) => o.name).filter(Boolean);
  }

  return [];
}

function numberFromProperty(property: unknown): number {
  if (!property || typeof property !== 'object') return Number.POSITIVE_INFINITY;
  const value = (property as NumberProperty).number;
  return typeof value === 'number' && Number.isFinite(value) ? value : Number.POSITIVE_INFINITY;
}
