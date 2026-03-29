'use client';

import { useMemo, useState } from 'react';

import SearchBox from '@/components/SearchBox';
import ShopCollection from '@/components/ShopCollection';

import type { ShopItem } from '@/components/ShopCollection';

type ShopProductsSectionProps = {
  items: ShopItem[];
};

export default function ShopProductsSection({
  items,
}: ShopProductsSectionProps) {
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(
    () => items.filter((item) => item.name.toLowerCase().includes(query.trim().toLowerCase())),
    [items, query],
  );

  return (
    <div>
      <SearchBox
        value={query}
        onChange={setQuery}
        className="max-w-xl mx-auto mt-6"
        placeholder="Search products by name..."
      />

      {filteredItems.length > 0 ? (
        <ShopCollection items={filteredItems} />
      ) : (
        <p className="text-center pt-10 pb-10">No products found.</p>
      )}
    </div>
  );
}
