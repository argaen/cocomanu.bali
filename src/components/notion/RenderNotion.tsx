'use client';

import React from 'react';
import { Render, withContentValidation } from '@9gustin/react-notion-render';
import type { NotionBlock, BlockComponentsMapperType } from '@9gustin/react-notion-render';
import type { DropedProps } from '@9gustin/react-notion-render/dist/hoc/withContentValidation';
import Image from 'next/image';
import {
  IMAGE_QUALITY_SECTION,
  IMAGE_SIZES_NOTION_INLINE,
} from '@/lib/next-image';


function ImageComponent(props: DropedProps): React.JSX.Element {
  return (
    <figure className="rnr-image">
      <Image
        src={props.media!.src}
        alt={props.media!.alt}
        width={1200}
        height={800}
        quality={IMAGE_QUALITY_SECTION}
        sizes={IMAGE_SIZES_NOTION_INLINE}
        loading="lazy"
        className="h-auto w-full max-h-[500px] object-contain"
      />
      <figcaption className="text-black-sand opacity-70 mt-1">
        {props.media!.alt}
      </figcaption>
    </figure>
  );
}

const CustomComponents: BlockComponentsMapperType = {
 'image': withContentValidation(ImageComponent), 
}

export default function RenderNotion({
  blocks
}: {
  blocks: NotionBlock[],
}): React.JSX.Element {

  return (
    <Render
      blocks={blocks as NotionBlock[]}
      blockComponentsMapper={CustomComponents}
      classNames
    />
  );

}
