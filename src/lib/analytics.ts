import { sendGAEvent } from '@next/third-parties/google';

export type PurchaseVertical = 'shop' | 'colive' | 'cowork';

export type PurchaseItem = {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
  item_variant?: string;
};

export function trackPurchase({
  transactionId,
  value,
  vertical,
  items,
}: {
  transactionId: string;
  value: number;
  vertical: PurchaseVertical;
  items: PurchaseItem[];
}): void {
  sendGAEvent('event', 'purchase', {
    transaction_id: transactionId,
    value,
    currency: 'IDR',
    vertical,
    items: items.map((item, index) => ({
      item_id: item.item_id,
      item_name: item.item_name,
      item_variant: item.item_variant,
      item_category: vertical,
      price: item.price,
      quantity: item.quantity ?? 1,
      index,
    })),
  });
}
