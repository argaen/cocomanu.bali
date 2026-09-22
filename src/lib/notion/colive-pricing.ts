import type { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { notion } from './client';
import { DATABASES } from './constants';
import type { ColivePricing, NumberProperty, RichTextProperty, TitleProperty } from './types';

type PackageRates = {
  daily: number;
  weekly: number;
  monthly: number;
};

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
          property: 'Minimum length',
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

  const name =
    ((page.properties.Name as unknown) as TitleProperty).title?.[0]?.plain_text ?? '';
  const minimumLength = numberFromProperty(page.properties['Minimum length'])
    || numberFromProperty(page.properties['Minimum Length'])
    || inferMinimumLengthFromName(name);

  const price = numberFromProperty(page.properties.Price);
  const formulaNightly = numberFromProperty(page.properties['Nightly Rate']);
  const dailyPrice = formulaNightly > 0
    ? formulaNightly
    : (minimumLength > 0 ? price / minimumLength : 0);

  return {
    id: page.id,
    name,
    price,
    dailyPrice,
    discount: discountFromProperty(page.properties.Discount),
    minimumLength,
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

/** Daily / Weekly / Monthly = Colive Prices rows with min length 1 / 7 / 30. */
function resolveRatesFromPricingTiers(pricing: ColivePricing[]): PackageRates | null {
  const byMin = (min: number) =>
    pricing.find((tier) => tier.minimumLength === min && tier.price > 0);

  const dailyTier = byMin(1);
  const weeklyTier = byMin(7);
  const monthlyTier = byMin(30);

  if (!dailyTier || !weeklyTier || !monthlyTier) return null;

  return {
    daily: dailyTier.price,
    weekly: weeklyTier.price,
    monthly: monthlyTier.price,
  };
}

function resolveDiscount(pricing: ColivePricing[]): number {
  const withPrice = pricing.filter((tier) => tier.price > 0);
  if (withPrice.length === 0) return 0;
  return withPrice[0].discount ?? 0;
}

/** Round to nearest IDR 50k, matching Notion `round(x / 50000) * 50000`. */
function roundToNearest50k(value: number): number {
  return Math.round(value / 50_000) * 50_000;
}

/**
 * Mirrors the Colive Bookings Notion `Price` formula:
 *
 *   round(
 *     if(Nights <= 7,
 *       Daily + (Nights - 1) * (Weekly - Daily) / 6,
 *       if(Nights <= 30,
 *         Weekly + (Nights - 7) * (Monthly - Weekly) / 23,
 *         Monthly + (Nights - 30) * Monthly / 30
 *       )
 *     ) / 50000
 *   ) * 50000 * (1 - Discount)
 *
 * Daily / Weekly / Monthly come from Colive Prices (1 / 7 / 30 night rows).
 */
export function estimateColiveTotalFromNights(
  nights: number,
  pricing: ColivePricing[],
): number {
  if (nights <= 0) return 0;

  const rates = resolveRatesFromPricingTiers(pricing);
  if (!rates) return 0;

  const { daily, weekly, monthly } = rates;
  const discount = resolveDiscount(pricing);

  let raw: number;
  if (nights <= 7) {
    raw = daily + (nights - 1) * (weekly - daily) / 6;
  } else if (nights <= 30) {
    raw = weekly + (nights - 7) * (monthly - weekly) / 23;
  } else {
    raw = monthly + (nights - 30) * (monthly / 30);
  }

  return Math.round(roundToNearest50k(raw) * (1 - discount));
}
