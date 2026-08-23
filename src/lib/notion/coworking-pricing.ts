import type { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { notion } from './client';
import { DATABASES } from './constants';
import type {
  CoworkingPriceEstimate,
  CoworkingPriceLine,
  CoworkingPricing,
  NumberProperty,
  RichTextProperty,
  TitleProperty,
} from './types';

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
  const name =
    ((page.properties.Name as unknown) as TitleProperty).title?.[0]?.plain_text ?? '';

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
    name,
    price: ((page.properties.Price as unknown) as NumberProperty).number ?? 0,
    dailyPrice:
      ((page.properties['Daily Price'] as unknown) as { formula?: { number?: number | null } })
        .formula?.number ?? 0,
    discount: discountFromProperty(page.properties.Discount),
    durationDays:
      numberFromProperty(page.properties['Minimum length'])
      || numberFromProperty(page.properties['Minimum Length'])
      || inferDurationDaysFromName(name),
    includes,
  };
}

function discountFromProperty(property: unknown): number {
  if (!property || typeof property !== 'object') return 0;

  const maybeNumber = (property as NumberProperty).number;
  if (typeof maybeNumber === 'number' && Number.isFinite(maybeNumber)) {
    return Math.min(1, Math.max(0, maybeNumber));
  }
  if (maybeNumber === null) return 0;

  const maybeFormula = (property as { formula?: { number?: number | null } }).formula?.number;
  if (typeof maybeFormula === 'number' && Number.isFinite(maybeFormula)) {
    return Math.min(1, Math.max(0, maybeFormula));
  }

  return 0;
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

function inferDurationDaysFromName(name: string): number {
  const normalized = name.trim().toLowerCase();

  if (
    normalized === 'daily'
    || normalized === 'daily pass'
    || normalized === 'day pass'
    || normalized === 'day'
    || normalized === '1 day'
  ) {
    return 1;
  }

  if (normalized.includes('week')) return 7;
  if (normalized.includes('month')) return 30;

  const match = normalized.match(/(\d+)\s*(?:day|d)/);
  if (match) return Number(match[1]);

  return 0;
}

function tierUnitPrice(tier: CoworkingPricing): number {
  return tier.price * (1 - tier.discount);
}

/**
 * Greedy pass stacking: e.g. 8 days = 1 week + 1 day, 37 days = 1 month + 1 week.
 */
export function estimateCoworkingTotalFromDays(
  days: number,
  pricing: CoworkingPricing[],
): CoworkingPriceEstimate {
  if (days <= 0) {
    return { days: 0, lines: [], totalIdr: 0, dailyRateIdr: 0 };
  }

  const tiers = pricing
    .filter((tier) => tier.durationDays > 0 && tier.price > 0)
    .sort((a, b) => b.durationDays - a.durationDays);

  if (tiers.length === 0) {
    return { days, lines: [], totalIdr: 0, dailyRateIdr: 0 };
  }

  const smallestTier = tiers[tiers.length - 1];
  let remaining = days;
  const lineMap = new Map<string, CoworkingPriceLine>();

  while (remaining > 0) {
    const tier =
      tiers.find((entry) => entry.durationDays <= remaining) ?? smallestTier;
    const unitPriceIdr = tierUnitPrice(tier);
    const existing = lineMap.get(tier.id);

    if (existing) {
      existing.quantity += 1;
      existing.totalIdr += unitPriceIdr;
    } else {
      lineMap.set(tier.id, {
        tierName: tier.name,
        quantity: 1,
        unitPriceIdr,
        totalIdr: unitPriceIdr,
      });
    }

    remaining -= tier.durationDays;
  }

  const lines = Array.from(lineMap.values());
  const totalIdr = lines.reduce((sum, line) => sum + line.totalIdr, 0);

  return {
    days,
    lines,
    totalIdr,
    dailyRateIdr: Math.round(totalIdr / days),
  };
}
