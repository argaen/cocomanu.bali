import { formatCompactPrice, formatPriceNumberAsK } from '@/lib/notion/product-price-format';

type PricingTierPriceProps = {
  price: number;
  discount: number;
  periodRate?: number;
  periodLabel?: string;
};

export default function PricingTierPrice({
  price,
  discount,
  periodRate,
  periodLabel,
}: PricingTierPriceProps) {
  const hasDiscount = discount > 0;
  const finalPrice = price * (1 - discount);
  const showPeriod = periodRate != null && periodRate > 0 && periodLabel;
  const finalPeriodRate = showPeriod ? periodRate * (1 - discount) : null;
  const discountPercent = Math.round(discount * 100);

  return (
    <div className="flex flex-col gap-2">
      {hasDiscount ? (
        <div className="flex items-center gap-x-3">
          <span className="text-base font-normal text-gray-400 line-through">
            IDR
            {' '}
            {formatCompactPrice(price)}
          </span>
          <span className="ml-auto shrink-0 rounded-full bg-moss-green-200/15 px-2.5 py-0.5 text-sm font-semibold text-moss-green-200">
            {discountPercent}% off
          </span>
        </div>
      ) : null}
      <div className="leading-snug">
        <span className="text-2xl font-extrabold">
          <span className="text-base font-semibold">IDR</span>
          {' '}
          {formatCompactPrice(finalPrice)}
        </span>
        {showPeriod && finalPeriodRate != null ? (
          <span className="text-base font-normal text-gray-400">
            {' '}
            ({formatPriceNumberAsK(finalPeriodRate)}
            {periodLabel})
          </span>
        ) : null}
      </div>
    </div>
  );
}
