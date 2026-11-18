import React from 'react';
import { twMerge } from 'tailwind-merge';

import { CheckCircle } from './svg';

export type PricingCardProps = {
  title: string;
  perks: string[];
  price: string | React.JSX.Element;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
}

export default function PricingCard({
  title,
  perks,
  price,
  selected = false,
  onSelect,
  className,
}: PricingCardProps) {
  return (
    <div
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      aria-pressed={onSelect ? selected : undefined}
      onClick={onSelect}
      onKeyDown={
        onSelect
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelect();
              }
            }
          : undefined
      }
      className={twMerge(
        'flex h-full w-full max-w-sm self-stretch flex-col rounded-xl bg-white-water px-6 py-4 text-left text-black mx-6 md:mx-0 intersect:animate-fade-up intersect-once lg:px-12',
        onSelect && 'cursor-pointer transition-shadow hover:shadow-lg',
        selected && 'ring-4 ring-dusk-glow-200 ring-offset-4 ring-offset-black-sand',
        className,
      )}
    >
      <h2 className="py-4">{title}</h2>
      <span className="text-gray-400 py-2 text-base">What You&apos;ll Get</span>
      <ul className="py-4 space-y-4 text-sm">
        {
          perks.map(perk => (
            <li key={perk} className="flex items-start">
              <CheckCircle className="mt-0.5 mr-2 size-4 shrink-0" />
              <span>{perk}</span>
            </li>
          ))
        }
      </ul>

      <div className="mt-auto">
        <p className="mt-6 py-4 text-2xl font-extrabold border-t-2 border-dashed">
          {price}
        </p>
      </div>
    </div>
  )

}
