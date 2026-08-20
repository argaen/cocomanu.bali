import { formatPriceNumberAsK } from '@/lib/notion/product-price-format';
import { WHATSAPP_PHONE_WA_ME } from '@/lib/notion/constants';
import { encodeWhatsAppText } from '@/lib/whatsapp';

/** Emoji via code points so source file encoding cannot corrupt prefilled messages. */
const WA = {
  house: '\u{1F3E0}',
  person: '\u{1F464}',
  email: '\u{1F4E7}',
  calendar: '\u{1F4C5}',
  moon: '\u{1F319}',
  money: '\u{1F4B0}',
} as const;

/**
 * Short client-side booking ref, e.g. CM-CL-A7K2X9.
 * Uses CM-CL- so accommodation bookings are distinct from shop orders (CM-S-…).
 */
export function createBookingId(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (const byte of bytes) {
    suffix += alphabet[byte % alphabet.length];
  }
  return `CM-CL-${suffix}`;
}

function formatStayDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export type ColiveBookingWhatsappInput = {
  checkIn: Date;
  checkOut: Date;
  nights: number;
  nightlyRateIdr: number;
  totalIdr: number;
  bookingId?: string;
};

export function buildColiveBookingWhatsappMessage({
  checkIn,
  checkOut,
  nights,
  nightlyRateIdr,
  totalIdr,
  bookingId = createBookingId(),
}: ColiveBookingWhatsappInput): string {
  const totalStr = totalIdr.toLocaleString('en-US', { maximumFractionDigits: 0 });

  return [
    `${WA.house} BOOKING *${bookingId}* DETAILS`,
    '',
    `${WA.person} Name: [Your Name]`,
    `${WA.email} Email: [Your Email]`,
    '',
    `${WA.calendar} Stay:`,
    `Check-in: ${formatStayDate(checkIn)}`,
    `Check-out: ${formatStayDate(checkOut)}`,
    `${WA.moon} Nights: ${nights}`,
    `Nightly rate: IDR ${formatPriceNumberAsK(nightlyRateIdr)}/night`,
    '',
    `${WA.money} Total:`,
    `*Rp ${totalStr}*`,
  ].join('\n');
}

export function buildWhatsappBookingUrl(message: string): string {
  const text = encodeWhatsAppText(message);
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE_WA_ME}&text=${text}`;
}
