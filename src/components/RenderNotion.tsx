import { Render, withContentValidation } from '@9gustin/react-notion-render';
import type { NotionBlock, BlockComponentsMapperType } from '@9gustin/react-notion-render';
import type { DropedProps } from '@9gustin/react-notion-render/dist/hoc/withContentValidation';
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';


function ImageComponent(props: DropedProps): JSX.Element {
  return (
    <figure className="rnr-image">
      <img
        src={props.media!.src}
        alt={props.media!.alt}
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
  blocks: BlockObjectResponse[],
}): JSX.Element {

  return (
    <Render
      blocks={blocks as NotionBlock[]}
      blockComponentsMapper={CustomComponents}
      classNames
    />
  );

}
