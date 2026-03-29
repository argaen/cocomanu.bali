export type TitleProperty = {
  title: { plain_text: string }[];
};

export type DateProperty = {
  date: { start: string };
};

export type RichTextProperty = {
  rich_text: { plain_text: string }[];
};

export type FormulaProperty = {
  formula: { string: string };
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

/** URLs for responsive shop images (Notion: Photo Desktop / Tablet / Mobile files). */
export type ProductImageSrcSet = {
  desktop352w: string;
  tablet358w: string;
  mobile654w: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantitySpec: ProductQuantitySpec;
  slug: string;
  image: string;
  imageSrcSet?: ProductImageSrcSet;
};
