import { notFound } from 'next/navigation';
import type { NotionBlock } from '@9gustin/react-notion-render';
import type { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { notion } from './client';
import { COLOR_MAP, DATABASES } from './constants';
import type {
  DateProperty,
  FilesProperty,
  FormulaProperty,
  MultiSelectProperty,
  NumberProperty,
  RichTextProperty,
  StatusProperty,
  TitleProperty,
} from './types';

export async function getPosts() {
  const response = await notion.databases.query({
    database_id: DATABASES.posts,
    filter: {
      property: 'Post Status',
      status: {
        equals: 'Done',
      },
    },
  });
  const results = response.results as DatabaseObjectResponse[];

  return results.map((page) => pageToPost(page));
}

export async function getPost(slug: string) {
  const response = await notion.databases.query({
    database_id: DATABASES.posts,
    filter: {
      property: 'Slug',
      rich_text: {
        equals: slug,
      },
    },
  });

  if (!response.results.length) {
    notFound();
  }

  const page = response.results[0];
  const blocks = await notion.blocks.children.list({ block_id: page.id });

  return {
    post: pageToPost(page as DatabaseObjectResponse),
    blocks: blocks.results as NotionBlock[],
  };
}

function pageToPost(page: DatabaseObjectResponse) {
  return {
    id: page.id,
    title: (page.properties.Title as TitleProperty).title[0].plain_text,
    date: (page.properties['Published Date'] as DateProperty).date.start,
    summary: (page.properties.Summary as RichTextProperty).rich_text[0].plain_text,
    slug: (page.properties.Slug as FormulaProperty).formula.string,
    image: (page.properties['Featured Image'] as FilesProperty).files[0].external.url,
    reading: (page.properties['Reading Time'] as NumberProperty).number,
    status: (page.properties['Post Status'] as StatusProperty).status.name,
    tags: (page.properties.Tags as MultiSelectProperty).multi_select.map((o) => ({
      ...o,
      color: COLOR_MAP[o.color] || o.color,
    })),
  };
}
