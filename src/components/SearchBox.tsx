'use client';

type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchBox({
  value,
  onChange,
  placeholder = 'Search by name...',
  className = '',
}: SearchBoxProps) {
  return (
    <div className={className}>
      <label htmlFor="search-products" className="sr-only">
        Search products by name
      </label>
      <input
        id="search-products"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-moss-green-300 bg-white-water px-4 py-3 text-black-sand outline-none focus:border-moss-green-200 focus:ring-2 focus:ring-moss-green-200/30"
      />
    </div>
  );
}
