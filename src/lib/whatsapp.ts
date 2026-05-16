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

/**
 * UTF-8 percent-encoding for WhatsApp `text` params (emoji and astral Unicode).
 * Uses byte encoding so characters are never misinterpreted as Latin-1.
 */
export function encodeWhatsAppText(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let encoded = '';
  for (let i = 0; i < bytes.length; i += 1) {
    const byte = bytes[i];
    if (
      (byte >= 0x41 && byte <= 0x5a)
      || (byte >= 0x61 && byte <= 0x7a)
      || (byte >= 0x30 && byte <= 0x39)
      || byte === 0x2d
      || byte === 0x5f
      || byte === 0x2e
      || byte === 0x7e
    ) {
      encoded += String.fromCharCode(byte);
    } else {
      encoded += `%${byte.toString(16).padStart(2, '0').toUpperCase()}`;
    }
  }
  return encoded;
}

/** `https://wa.me/…` with optional pre-filled message. */
export function whatsappContactHref(prefillMessage?: string): string {
  const base = `https://wa.me/${WHATSAPP_PHONE_WA_ME}`;
  if (!prefillMessage?.trim()) {
    return base;
  }
  return `${base}?text=${encodeWhatsAppText(prefillMessage)}`;
}
