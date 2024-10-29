import React from 'react';

import { CheckCircle } from "./svg";

export type PricingCardProps = {
  title: string;
  perks: string[];
  price: string | JSX.Element;
}

export default function PricingCard({
  title,
  perks,
  price,
}: PricingCardProps) {
  return (
    <div className="bg-white-water text-black rounded-xl py-4 px-6 lg:px-12 mx-6 md:mx-0 intersect:animate-fade-up intersect-once">
      <h2 className="py-4">{title}</h2>
      <span className="text-gray-400 py-2 text-base">What You&apos;ll Get</span>
      <ul className="py-4 space-y-4 text-sm">
        {
          perks.map(perk => (
            <li key={perk} className="flex">
              <CheckCircle className="size-4 mr-2" />
              {perk}
            </li>
          ))
        }
      </ul>

      <p className="mt-6 py-4 text-2xl font-extrabold border-t-2 border-dashed">
        {price}
      </p>

      <button className="bg-moss-green-200 w-full text-white-water rounded-lg py-2">
        Choose
      </button>
    </div>
  )

}
