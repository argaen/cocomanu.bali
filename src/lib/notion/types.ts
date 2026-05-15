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
};

export type CoworkingPricing = {
  id: string;
  name: string;
  price: number;
  dailyPrice: number;
  includes: string[];
};

export type ColivePricing = {
  id: string;
  name: string;
  price: number;
  dailyPrice: number;
  minimumLength: number;
  includes: string[];
};
