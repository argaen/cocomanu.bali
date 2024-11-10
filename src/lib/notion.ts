import { Client } from "@notionhq/client";
import { notFound } from "next/navigation";
import type { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";

// Initializing a client
export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function getPosts() {
  const response = await notion.databases.query({
    database_id: '139452d3e01380969e3edd1c8b5ca44a',
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
    database_id: '139452d3e01380969e3edd1c8b5ca44a',
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
    blocks: blocks.results,
  };
}

function pageToPost(page: DatabaseObjectResponse) {
  return {
    id: page.id,
    title: ((page.properties['Name'] as unknown) as TitleProperty).title[0].plain_text,
    date: ((page.properties['Published Date'] as unknown) as DateProperty).date.start,
    summary: ((page.properties['Summary'] as unknown) as RichTextProperty).rich_text[0].plain_text,
    slug: ((page.properties['Slug'] as unknown) as FormulaProperty).formula.string,
    image: ((page.properties['Featured Image'] as unknown) as FilesProperty).files[0].external.url,
    reading: ((page.properties['Reading Time'] as unknown) as NumberProperty).number,
    status: ((page.properties['Post Status'] as unknown) as SelectProperty).status.name,
    tags: ((page.properties['Tags'] as unknown) as MultiSelectProperty).multi_select,
  };
}

type TitleProperty = {
  title: { plain_text: string }[];
};

type DateProperty = {
  date: { start: string };
};

type RichTextProperty = {
  rich_text: { plain_text: string }[];
};

type FormulaProperty = {
  formula: { string: string };
};

type FilesProperty = {
  files: { external: { url: string } }[];
};

type NumberProperty = {
  number: number;
};

type MultiSelectProperty = {
  multi_select: {
    id: string,
    name: string,
    color: string,
  }[];
}

type SelectProperty = {
  status: {
    id: string,
    name: string,
    color: string,
  };
}
