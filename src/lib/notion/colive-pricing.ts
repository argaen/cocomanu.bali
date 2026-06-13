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
    minimumLength: numberFromProperty(page.properties['Minimum length'])
      || numberFromProperty(page.properties['Minimum Length'])
      || inferMinimumLengthFromName(
        ((page.properties.Name as unknown) as TitleProperty).title?.[0]?.plain_text ?? '',
      ),
    includes,
  };
}

function inferMinimumLengthFromName(name: string): number {
  const normalized = name.trim().toLowerCase();

  if (
    normalized === '1 night'
    || normalized === 'night'
    || normalized === 'nightly'
    || normalized === 'nightly pass'
    || normalized === 'night pass'
  ) {
    return 1;
  }

  if (normalized.includes('week')) return 7;
  if (normalized.includes('month')) return 30;

  const match = normalized.match(/(\d+)\s*(?:night|day|n)/);
  if (match) return Number(match[1]);

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

function roundColiveTotal(value: number): number {
  return Math.round(value / 50_000) * 50_000;
}

function interpolateBetweenTiers(
  nights: number,
  lower: ColivePricing,
  upper: ColivePricing,
): number {
  if (nights <= lower.minimumLength) return lower.price;
  if (nights >= upper.minimumLength) return upper.price;

  const slope =
    (upper.price - lower.price) / (upper.minimumLength - lower.minimumLength);
  return lower.price + (nights - lower.minimumLength) * slope;
}

export function estimateColiveTotalFromNights(
  nights: number,
  pricing: ColivePricing[],
): number {
  if (nights <= 0) return 0;

  const tiers = pricing
    .filter((tier) => tier.minimumLength > 0 && tier.price > 0)
    .sort((a, b) => a.minimumLength - b.minimumLength);

  if (tiers.length === 0) return 0;

  if (tiers.length === 1) {
    const tier = tiers[0];
    const nightly =
      tier.dailyPrice > 0 ? tier.dailyPrice : tier.price / tier.minimumLength;
    return roundColiveTotal(nightly * nights);
  }

  const first = tiers[0];
  const last = tiers[tiers.length - 1];

  let rawTotal: number;

  if (nights <= first.minimumLength) {
    rawTotal = (first.price / first.minimumLength) * nights;
  } else if (nights >= last.minimumLength) {
    const cappedNightly =
      last.dailyPrice > 0 ? last.dailyPrice : last.price / last.minimumLength;
    rawTotal = last.price + (nights - last.minimumLength) * cappedNightly;
  } else {
    let matched = false;
    rawTotal = last.price;

    for (let i = 0; i < tiers.length - 1; i++) {
      const lower = tiers[i];
      const upper = tiers[i + 1];
      if (nights >= lower.minimumLength && nights <= upper.minimumLength) {
        rawTotal = interpolateBetweenTiers(nights, lower, upper);
        matched = true;
        break;
      }
    }

    if (!matched) {
      const nightly =
        last.dailyPrice > 0 ? last.dailyPrice : last.price / last.minimumLength;
      rawTotal = nightly * nights;
    }
  }

  return roundColiveTotal(rawTotal);
}
