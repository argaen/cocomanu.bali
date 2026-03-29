import { formatPriceNumberAsK } from '@/lib/notion/product-price-format';

/** WhatsApp `wa.me` number (digits only, no +). Default: +62 812-2987-0979 → 6281229870979 */
export const WHATSAPP_ORDER_PHONE =
  process.env.NEXT_PUBLIC_WHATSAPP_ORDER_PHONE ?? '6281229870979';

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
      return `- ${line.name}${middle} x${line.quantity} ${formatPriceNumberAsK(lineTotalIdr)}`;
    })
    .join('\n');

  const totalIdr = lines.reduce((sum, line) => sum + line.unitPriceIdr * line.quantity, 0);
  const totalStr = totalIdr.toLocaleString('en-US', { maximumFractionDigits: 0 });

  return `Name:\n\nLocation:\n\nOrder:\n${orderBody}\n\nTotal: Rp ${totalStr}`;
}

export function buildWhatsappOrderUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_ORDER_PHONE}?text=${encodeURIComponent(message)}`;
}
