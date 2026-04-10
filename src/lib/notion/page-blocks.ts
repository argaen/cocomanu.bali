import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { notion } from './client';

export async function fetchBlocksRecursively(
  blockId: string,
  depth = 0,
): Promise<BlockObjectResponse[]> {
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
