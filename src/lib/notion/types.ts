export type TitleProperty = {
  title: { plain_text: string }[];
};

export type DateProperty = {
  date: { start: string };
};

export type RichTextProperty = {
  rich_text: { plain_text: string }[];
};

/** Notion formula results vary by `type`; slug formulas are usually `{ type: 'string', string: ... }`. */
export type FormulaProperty = {
  formula: {
    type?: string;
    string?: string | null;
    number?: number | null;
  };
};

export type FilesProperty = {
  files: { external: { url: string } }[];
};

export type NumberProperty = {
  number: number;
};

export type MultiSelectProperty = {
  multi_select: {
    id: string;
    name: string;
    color: string;
  }[];
};

export type StatusProperty = {
  status: {
    id: string;
    name: string;
    color: string;
  };
};

export type SelectProperty = {
  select: {
    id: string;
    name: string;
    color: string;
  };
};

export type Plant = {
  id: string;
  name: string;
  scientific: string;
  slug: string;
  image: string;
  layer: {
    id: string;
    name: string;
    color: string;
  };
  uses: {
    id: string;
    name: string;
    color: string;
  }[];
};

export type ProductQuantitySpec = {
  quantity: number;
  unit: string;
};

export type Product = {
  id: string;
  name: string;
  /** Optional variant label from Notion (e.g. flavor, color). */
  variant: string;
  /**
   * Rows with the same group key are shown under one heading in the shop.
   * Uses Notion `Product line` when set, otherwise the product `Name` (variants should share the same name/line).
   */
  groupKey: string;
  description: string;
  price: number;
  quantitySpec: ProductQuantitySpec;
  category: string;
  categoryColor: string;
  slug: string;
  image: string;
  /** Notion `Order` column (lower = earlier in shop). */
  order: number;
};

export type CoworkingPricing = {
  id: string;
  name: string;
  price: number;
  dailyPrice: number;
  /** Fraction off from Notion `Discount` (0–1). `0.2` = 20% off; `0` = full price. */
  discount: number;
  /** Days of coworking included in the pass (Notion `Days`). */
  includedDays: number;
  /** Calendar days the pass can be used within from the start date (Notion `Validity`). */
  validityDays: number;
  includes: string[];
};

export type CoworkingPriceLine = {
  tierName: string;
  quantity: number;
  unitPriceIdr: number;
  totalIdr: number;
};

export type CoworkingPriceEstimate = {
  days: number;
  lines: CoworkingPriceLine[];
  totalIdr: number;
  dailyRateIdr: number;
};

export type ColivePricing = {
  id: string;
  name: string;
  price: number;
  dailyPrice: number;
  /** Fraction off from Notion `Discount` (0–1). `0.2` = 20% off; `0` = full price. */
  discount: number;
  minimumLength: number;
  includes: string[];
};

export type CafeMenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  slug: string;
  /** Notion `Health tags` multi-select (e.g. Gluten-free, Vegan, Contains nuts). */
  healthTags: { name: string; color: string }[];
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  /** Notion `Page` select/multi-select values this FAQ belongs to (e.g. Colive, Cowork). */
  pages: string[];
  /** Optional sort order from Notion `Order`. */
  order: number;
};
