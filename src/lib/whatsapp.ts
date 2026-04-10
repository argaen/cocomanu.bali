import { WHATSAPP_PHONE_WA_ME } from '@/lib/notion/constants';

function normalizeWaDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** Human-readable label for `wa.me` numbers (Indonesia +62 layout when applicable). */
export function whatsappDisplayPhone(digits: string = WHATSAPP_PHONE_WA_ME): string {
  const d = normalizeWaDigits(digits);
  if (d.startsWith('62') && d.length >= 11) {
    const rest = d.slice(2);
    const p1 = rest.slice(0, 3);
    const p2 = rest.slice(3, 7);
    const p3 = rest.slice(7);
    return ['+62', p1, p2, p3].filter(Boolean).join(' ');
  }
  return d ? `+${d}` : '';
}

/** `https://wa.me/…` with optional pre-filled message. */
export function whatsappContactHref(prefillMessage?: string): string {
  const base = `https://wa.me/${WHATSAPP_PHONE_WA_ME}`;
  if (!prefillMessage?.trim()) {
    return base;
  }
  return `${base}?text=${encodeURIComponent(prefillMessage)}`;
}
