'use client';

type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Defaults to `search-products` (shop). */
  inputId?: string;
  /** Screen-reader label for the field. */
  srLabel?: string;
};

export default function SearchBox({
  value,
  onChange,
  placeholder = 'Search by name...',
  className = '',
  inputId = 'search-products',
  srLabel = 'Search products by name',
}: SearchBoxProps) {
  return (
    <div className={className}>
      <label htmlFor={inputId} className="sr-only">
        {srLabel}
      </label>
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-moss-green-300 bg-white-water px-4 py-3 text-black-sand outline-none focus:border-moss-green-200 focus:ring-2 focus:ring-moss-green-200/30"
      />
    </div>
  );
}
