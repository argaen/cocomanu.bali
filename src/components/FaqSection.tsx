'use client';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';

import Section from '@/components/Section';
import type { FaqItem } from '@/lib/notion/types';

export type FaqSectionProps = {
  items: FaqItem[];
  /** Optional override; defaults to rainy-day to sit under a dark pricing band. */
  className?: string;
};

export default function FaqSection({ items, className }: FaqSectionProps) {
  if (items.length === 0) return null;

  return (
    <Section
      header="FAQ"
      headerClassName="text-dawn-rays-200"
      className={className}
      content={(
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 md:px-10">
          {items.map((item, index) => (
            <Disclosure
              key={item.id}
              as="div"
              defaultOpen={index === 0}
              className="rounded-2xl bg-black-sand px-5 py-4 shadow-md md:px-6 md:py-5"
            >
              {({ open }) => (
                <>
                  <DisclosureButton className="flex w-full cursor-pointer items-start gap-4 text-left">
                    <span className="min-w-0 flex-1 font-semibold leading-snug text-white-water">
                      {item.question}
                    </span>
                    <span
                      aria-hidden
                      className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-dawn-rays-200 text-white-water"
                    >
                      {open ? (
                        <MinusIcon className="size-4" />
                      ) : (
                        <PlusIcon className="size-4" />
                      )}
                    </span>
                  </DisclosureButton>
                  <DisclosurePanel className="mt-3 pr-12 text-base leading-relaxed text-white-water/90 md:text-lg">
                    {item.answer}
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      )}
    />
  );
}
