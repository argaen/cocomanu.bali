import { Client } from "@notionhq/client";
import { notFound } from "next/navigation";
import type { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const COLOR_MAP: {[color: string]: string} = {
  brown: '#a52a2acc',
  green: '#928E43',
  pink: '#dc93b2',
  orange: '#ffa500dd',
  blue: '#6C9396',
  purple: '#800080cc',
  default: '#a52a2acc',
  yellow: '#D6AC42',
  red: '#C77743',
}

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
    title: ((page.properties['Title'] as unknown) as TitleProperty).title[0].plain_text,
    date: ((page.properties['Published Date'] as unknown) as DateProperty).date.start,
    summary: ((page.properties['Summary'] as unknown) as RichTextProperty).rich_text[0].plain_text,
    slug: ((page.properties['Slug'] as unknown) as FormulaProperty).formula.string,
    image: ((page.properties['Featured Image'] as unknown) as FilesProperty).files[0].external.url,
    reading: ((page.properties['Reading Time'] as unknown) as NumberProperty).number,
    status: ((page.properties['Post Status'] as unknown) as StatusProperty).status.name,
    tags: ((page.properties['Tags'] as unknown) as MultiSelectProperty).multi_select.map(
      o => ({
        ...o,
        color: COLOR_MAP[o.color] || o.color,
      })
    ),
  };
}

export async function getPlants() {
  const response = await notion.databases.query({
    database_id: '13b452d3e01380ef9d46c2993f288622',
    sorts: [
      {
        property: "Name",
        direction: "ascending",
      },
    ],
  });
  const results = response.results as DatabaseObjectResponse[];

  return results.map((page) => pageToPlant(page));
}

export async function getPlant(slug: string) {
  const response = await notion.databases.query({
    database_id: '13b452d3e01380ef9d46c2993f288622',
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
    plant: pageToPlant(page as DatabaseObjectResponse),
    blocks: blocks.results,
  };
}

function pageToPlant(page: DatabaseObjectResponse) {
  return {
    id: page.id,
    name: ((page.properties['Name'] as unknown) as TitleProperty).title[0].plain_text,
    image: ((page.properties['Photo'] as unknown) as FilesProperty).files[0]?.external.url,
    layer: {
      ...((page.properties['Layer'] as unknown) as SelectProperty).select,
      color: COLOR_MAP[((page.properties['Layer'] as unknown) as SelectProperty).select.color],

    },
    uses: ((page.properties['Uses'] as unknown) as MultiSelectProperty).multi_select.map(
      o => ({
        ...o,
        color: COLOR_MAP[o.color] || o.color,
      })
    ),
    scientific: ((page.properties['Scientific Name'] as unknown) as RichTextProperty).rich_text[0]?.plain_text,
    height: ((page.properties['Target Height'] as unknown) as NumberProperty).number,
    width: ((page.properties['Canopy Width'] as unknown) as NumberProperty).number,
    slug: ((page.properties['Slug'] as unknown) as FormulaProperty).formula.string,
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

type StatusProperty = {
  status: {
    id: string,
    name: string,
    color: string,
  };
}

type SelectProperty = {
  select: {
    id: string,
    name: string,
    color: string,
  };
}
