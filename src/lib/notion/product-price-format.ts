import type { Product } from './types';

/**
 * Formats a whole-number price using k for thousands (e.g. 10000 → 10k, 100000 → 100k).
 * Values under 1000 stay as digits. One decimal is used when needed (e.g. 12500 → 12.5k).
 */
export function formatPriceNumberAsK(value: number): string {
  const n = Math.round(Math.max(0, value));
  if (!Number.isFinite(n)) return '0';
  if (n < 1000) {
    return String(n);
  }
  const k = n / 1000;
  const rounded = Number(k.toFixed(1));
  const body = rounded % 1 === 0 ? String(Math.round(k)) : String(rounded);
  return `${body}k`;
}

/** Compact total price for display, e.g. 1.55M, 3.5M, 12M */
export function formatCompactPrice(value: number): string {
  const amount = Math.max(0, Math.round(value));
  if (!Number.isFinite(amount)) return '0';
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    if (millions % 1 === 0) return `${millions.toFixed(0)}M`;
    return `${millions.toFixed(2).replace(/\.?0+$/, '')}M`;
  }
  return formatPriceNumberAsK(amount);
}

/** e.g. IDR 10k (16 buds) */
export function formatProductPriceDisplay(
  product: Pick<Product, 'price' | 'quantitySpec'>,
): string {
  const { price, quantitySpec } = product;
  const amount = `IDR ${formatPriceNumberAsK(price)}`;

  const { quantity, unit } = quantitySpec;
  if (quantity > 0 && unit) {
    return `${amount} (${quantity} ${unit})`;
  }
  if (quantity > 0) {
    return `${amount} (${quantity})`;
  }
  return amount;
}
