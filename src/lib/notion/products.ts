import { notFound } from 'next/navigation';
import type { BlockObjectResponse, DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { notion } from './client';
import { COLOR_MAP, DATABASES } from './constants';
import type {
  FilesProperty,
  FormulaProperty,
  MultiSelectProperty,
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

export async function getProductDetail(slug: string): Promise<{ product: Product; blocks: BlockObjectResponse[] }> {
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

  const page = response.results[0] as DatabaseObjectResponse;
  const blocksRes = await fetchBlocksRecursively(page.id);

  return {
    product: pageToProduct(page),
    blocks: blocksRes,
  };
}

async function fetchBlocksRecursively(blockId: string, depth = 0): Promise<BlockObjectResponse[]> {
  const all: BlockObjectResponse[] = [];
  let startCursor: string | undefined;

  while (true) {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      start_cursor: startCursor,
    });

    const batch = response.results as BlockObjectResponse[];

    for (const block of batch) {
      all.push(depth > 0 ? withVisualIndent(block, depth) : block);

      if (block.has_children) {
        const children = await fetchBlocksRecursively(block.id, depth + 1);
        all.push(...children);
      }
    }

    if (!response.has_more || !response.next_cursor) {
      break;
    }
    startCursor = response.next_cursor;
  }

  return all;
}

function withVisualIndent(block: BlockObjectResponse, depth: number): BlockObjectResponse {
  if (block.type !== 'bulleted_list_item' && block.type !== 'numbered_list_item') {
    return block;
  }

  // Use em-space characters so indentation stays visible in normal paragraph rendering.
  const indent = '\u2003\u2003'.repeat(Math.min(depth, 3));
  const node = { ...block } as any;
  const payload = { ...node[block.type] };
  const rich = Array.isArray(payload.rich_text) ? [...payload.rich_text] : [];

  if (rich.length > 0) {
    const first = { ...rich[0] };
    const childPrefix = block.type === 'bulleted_list_item' ? '• ' : '↳ ';
    first.plain_text = `${indent}${childPrefix}${first.plain_text ?? ''}`;
    if (first.text?.content != null) {
      first.text = { ...first.text, content: `${indent}${childPrefix}${first.text.content}` };
    }
    rich[0] = first;
  }

  // Renderer doesn't support semantic nested list items well.
  // Convert nested children to paragraph lines so hierarchy is visible and not mistaken for same-level bullets.
  return {
    ...node,
    type: 'paragraph',
    paragraph: {
      rich_text: rich,
      color: 'default',
    },
    has_children: false,
  } as BlockObjectResponse;
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

function categoryFromProperty(property: unknown): string {
  if (!property || typeof property !== 'object') return '';

  const fromSelectOrText = selectOrTextToString(property);
  if (fromSelectOrText) return fromSelectOrText;

  const maybeMultiSelect = property as MultiSelectProperty;
  if (
    Array.isArray(maybeMultiSelect.multi_select) &&
    maybeMultiSelect.multi_select.length > 0 &&
    typeof maybeMultiSelect.multi_select[0]?.name === 'string'
  ) {
    return maybeMultiSelect.multi_select[0].name;
  }

  return '';
}

function categoryColorFromProperty(property: unknown): string {
  if (!property || typeof property !== 'object') return '';

  const maybeSelect = property as SelectProperty;
  if (maybeSelect.select?.color) {
    return COLOR_MAP[maybeSelect.select.color] || COLOR_MAP.default;
  }

  const maybeMultiSelect = property as MultiSelectProperty;
  if (
    Array.isArray(maybeMultiSelect.multi_select) &&
    maybeMultiSelect.multi_select.length > 0 &&
    typeof maybeMultiSelect.multi_select[0]?.color === 'string'
  ) {
    return COLOR_MAP[maybeMultiSelect.multi_select[0].color] || COLOR_MAP.default;
  }

  return COLOR_MAP.default;
}

function pageToProduct(page: DatabaseObjectResponse): Product {
  const quantity = ((page.properties.Quantity as unknown) as NumberProperty).number ?? 0;
  const unit = selectOrTextToString(page.properties['Quantity unit']);
  const category = categoryFromProperty(page.properties.Categories);
  const categoryColor = categoryColorFromProperty(page.properties.Categories);

  const image = firstFileUrlFromProperty(page.properties.Photo);

  return {
    id: page.id,
    name: ((page.properties.Name as unknown) as TitleProperty).title[0]?.plain_text ?? '',
    description: ((page.properties.Description as unknown) as RichTextProperty).rich_text[0]?.plain_text ?? '',
    price: ((page.properties.Price as unknown) as NumberProperty).number ?? 0,
    quantitySpec: { quantity, unit },
    category,
    categoryColor,
    slug: ((page.properties.Slug as unknown) as FormulaProperty).formula.string ?? '',
    image,
  };
}

export { formatProductPriceDisplay, formatPriceNumberAsK } from './product-price-format';
