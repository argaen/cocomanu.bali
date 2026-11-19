'use client';

import type { LucideIcon } from 'lucide-react';
import { CircleHelp, Leaf, Nut, WheatOff } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import type { CafeMenuItem } from '@/lib/notion/types';

const TAG_ICONS: { match: string; icon: LucideIcon }[] = [
  { match: 'gluten free', icon: WheatOff },
  { match: 'vegan', icon: Leaf },
  { match: 'contains nuts', icon: Nut },
  { match: 'nuts', icon: Nut },
];

function tagKey(label: string): string {
  return label.trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
}

function iconForTag(label: string): LucideIcon {
  const key = tagKey(label);
  return TAG_ICONS.find((entry) => entry.match === key)?.icon ?? CircleHelp;
}

function HealthTagIcon({ name, color }: CafeMenuItem['healthTags'][number]) {
  const Icon = iconForTag(name);
  const tooltipId = useId();
  const rootRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    const close = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };

    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  return (
    <button
      ref={rootRef}
      type="button"
      className="group relative inline-flex size-9 items-center justify-center rounded-full bg-black-sand/10 transition-colors hover:bg-black-sand/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dawn-rays-200 md:size-10"
      style={{ color }}
      aria-label={name}
      aria-describedby={open ? tooltipId : undefined}
      onClick={() => setOpen((visible) => !visible)}
      onBlur={() => setOpen(false)}
    >
      <Icon className="size-5 md:size-6" aria-hidden />
      <span
        id={tooltipId}
        role="tooltip"
        className={`pointer-events-none absolute top-1/2 left-full z-20 ml-2 -translate-y-1/2 rounded-md bg-black-sand px-2.5 py-1 text-sm font-medium whitespace-nowrap text-white-water shadow-xl transition-opacity md:text-base ${
          open
            ? 'visible opacity-100'
            : 'invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100'
        }`}
      >
        {name}
      </span>
    </button>
  );
}

export type CafeHealthTagsProps = {
  tags: CafeMenuItem['healthTags'];
  className?: string;
};

export default function CafeHealthTags({ tags, className }: CafeHealthTagsProps) {
  if (tags.length === 0) return null;

  return (
    <ul className={twMerge('flex flex-wrap items-center gap-1.5', className)}>
      {tags.map((tag) => (
        <li key={tag.name}>
          <HealthTagIcon name={tag.name} color={tag.color} />
        </li>
      ))}
    </ul>
  );
}
