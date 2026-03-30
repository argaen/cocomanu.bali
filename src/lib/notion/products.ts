import { notFound } from 'next/navigation';
import type { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { notion } from './client';
import { DATABASES } from './constants';
import type {
  FilesProperty,
  FormulaProperty,
  NumberProperty,
  Product,
  RichTextProperty,
  SelectProperty,
  TitleProperty,
} from './types';

type GetProductsProps = {
  limit?: number;
};

export async function getProducts({
  limit,
}: GetProductsProps = {}): Promise<Product[]> {
  if (!DATABASES.products) return [];
  if (limit !== undefined && limit <= 0) return [];

  const all: DatabaseObjectResponse[] = [];
  let startCursor: string | undefined;

  const filter = {
    property: 'Available',
    checkbox: {
      equals: true,
    },
  } as const;

  const sorts = [
    {
      property: 'Name',
      direction: 'ascending' as const,
    },
  ];

  while (true) {
    if (limit != null && all.length >= limit) {
      return all.slice(0, limit).map((page) => pageToProduct(page));
    }

    const pageSize =
      limit != null ? Math.min(100, limit - all.length) : 100;

    const response = await notion.databases.query({
      database_id: DATABASES.products,
      filter,
      sorts,
      page_size: pageSize,
      start_cursor: startCursor,
    });

    const batch = response.results as DatabaseObjectResponse[];
    all.push(...batch);

    if (limit != null && all.length >= limit) {
      return all.slice(0, limit).map((page) => pageToProduct(page));
    }
    if (!response.has_more || !response.next_cursor) {
      break;
    }
    startCursor = response.next_cursor;
  }

  return all.map((page) => pageToProduct(page));
}

export async function getProduct(slug: string): Promise<Product> {
  if (!DATABASES.products) {
    notFound();
  }

  const response = await notion.databases.query({
    database_id: DATABASES.products,
    filter: {
      and: [
        {
          property: 'Slug',
          rich_text: {
            equals: slug,
          },
        },
        {
          property: 'Available',
          checkbox: {
            equals: true,
          },
        },
      ],
    },
  });

  if (!response.results.length) {
    notFound();
  }

  return pageToProduct(response.results[0] as DatabaseObjectResponse);
}

function firstFileUrlFromProperty(property: unknown): string {
  if (!property || typeof property !== 'object') return '';
  const files = (property as FilesProperty).files;
  if (!Array.isArray(files) || files.length === 0) return '';
  const first = files[0] as { external?: { url: string }; file?: { url: string } };
  return first.external?.url ?? first.file?.url ?? '';
}

function selectOrTextToString(property: unknown): string {
  if (!property || typeof property !== 'object') return '';

  const maybeRichText = property as RichTextProperty;
  if (Array.isArray(maybeRichText.rich_text) && maybeRichText.rich_text.length > 0) {
    return maybeRichText.rich_text[0]?.plain_text ?? '';
  }

  const maybeSelect = property as SelectProperty;
  if (maybeSelect.select && typeof maybeSelect.select.name === 'string') {
    return maybeSelect.select.name;
  }

  return '';
}

function pageToProduct(page: DatabaseObjectResponse): Product {
  const quantity = ((page.properties.Quantity as unknown) as NumberProperty).number ?? 0;
  const unit = selectOrTextToString(page.properties['Quantity unit']);

  const image = firstFileUrlFromProperty(page.properties.Photo);

  return {
    id: page.id,
    name: ((page.properties.Name as unknown) as TitleProperty).title[0]?.plain_text ?? '',
    description: ((page.properties.Description as unknown) as RichTextProperty).rich_text[0]?.plain_text ?? '',
    price: ((page.properties.Price as unknown) as NumberProperty).number ?? 0,
    quantitySpec: { quantity, unit },
    slug: ((page.properties.Slug as unknown) as FormulaProperty).formula.string ?? '',
    image,
  };
}

export { formatProductPriceDisplay, formatPriceNumberAsK } from './product-price-format';
