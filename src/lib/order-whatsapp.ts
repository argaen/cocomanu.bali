import { formatPriceNumberAsK } from '@/lib/notion/product-price-format';
import { WHATSAPP_PHONE_WA_ME } from '@/lib/notion/constants';
import { encodeWhatsAppText } from '@/lib/whatsapp';

/** Emoji via code points so source file encoding cannot corrupt prefilled messages. */
const WA = {
  package: '\u{1F4E6}',
  person: '\u{1F464}',
  pin: '\u{1F4CD}',
  phone: '\u{1F4F1}',
  cart: '\u{1F6D2}',
  money: '\u{1F4B0}',
} as const;

export type OrderCartLine = {
  name: string;
  packLabel: string;
  quantity: number;
  unitPriceIdr: number;
};

export function buildOrderWhatsappMessage(lines: OrderCartLine[]): string {
  const orderBody = lines
    .map((line) => {
      const pack = line.packLabel.trim();
      const middle = pack ? ` ${pack}` : '';
      const lineTotalIdr = line.unitPriceIdr * line.quantity;
      return `- ${line.name}${middle} x${line.quantity} IDR ${formatPriceNumberAsK(lineTotalIdr)}`;
    })
    .join('\n');

  const totalIdr = lines.reduce((sum, line) => sum + line.unitPriceIdr * line.quantity, 0);
  const totalStr = totalIdr.toLocaleString('en-US', { maximumFractionDigits: 0 });

  return [
    `${WA.package} ORDER DETAILS`,
    '',
    `${WA.person} Name: [Your Name]`,
    `${WA.pin} Location: [Your Address / Area]`,
    `${WA.phone} Phone: [Your Phone Number]`,
    '',
    `${WA.cart} Order:`,
    orderBody,
    '',
    `${WA.money} Total:`,
    `*Rp ${totalStr}*`,
  ].join('\n');
}

export function buildWhatsappOrderUrl(message: string): string {
  const text = encodeWhatsAppText(message);
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE_WA_ME}&text=${text}`;
}
