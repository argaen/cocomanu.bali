import type { StaticImageData } from 'next/image';

/** Full-viewport hero backgrounds (LCP). */
export const IMAGE_QUALITY_HERO = 75;

/** In-page section photos (half-width on sm+, galleries). */
export const IMAGE_QUALITY_SECTION = 75;

/** Heavily filtered / decorative backgrounds — keep tiny. */
export const IMAGE_QUALITY_DECORATIVE = 10;

/** Product, plant, and blog thumbnails. */
export const IMAGE_QUALITY_CARD = 75;

/**
 * Full-bleed viewport heroes (`fill` + `object-cover`).
 *
 * `100vw` underserves phones: Next.js picks a width ≈ viewport × DPR, then
 * `object-cover` crops the landscape file to fill 100vh, so the visible crop is
 * upscaled. Portrait uses `150vh` (≈ 3:2 cover width) so the optimizer can
 * send the full 2048w source instead of a ~1080w variant.
 */
export const IMAGE_SIZES_FULL_VIEWPORT =
  '(orientation: portrait) 150vh, 100vw';

/**
 * Home cowork/colive/cafe blocks (`fill` + `object-cover` in a
 * `h-[550px] lg:h-[700px]` frame). Slot width is 100vw / 50vw, but a 3:2
 * photo is cropped to cover the *height*, so the optimizer must target
 * `height × 3/2` or phones get a ~750w file stretched over 550 CSS px.
 */
export const IMAGE_SIZES_HALF_VIEWPORT =
  '(max-width: 1023px) 825px, 1050px';

/** Gallery carousel: w-8/12 on mobile, w-3/5 from md. */
export const IMAGE_SIZES_GALLERY = '(max-width: 767px) 67vw, 60vw';

/** Shop / plant grid cards (up to 4 columns). */
export const IMAGE_SIZES_GRID_CARD = '(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw';

/** Shop product modal hero. */
export const IMAGE_SIZES_MODAL_HERO = '(max-width: 767px) 100vw, 768px';

/** Article / product detail hero inside max-width containers. */
export const IMAGE_SIZES_ARTICLE_HERO = '(max-width: 1024px) 100vw, 1024px';

/** Blog list thumbnails (fixed 250px column). */
export const IMAGE_SIZES_BLOG_THUMB = '250px';

/** Inline Notion images in article content. */
export const IMAGE_SIZES_NOTION_INLINE = '(max-width: 768px) 100vw, 768px';

/** Tiny SVG blur for remote or public-folder `next/image` URLs. */
export const REMOTE_IMAGE_BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2U4ZTZkZCIvPjwvc3ZnPg==';

export function blurPlaceholderProps(src: string | StaticImageData) {
  if (typeof src === 'string') {
    return {
      placeholder: 'blur' as const,
      blurDataURL: REMOTE_IMAGE_BLUR_DATA_URL,
    };
  }
  return { placeholder: 'blur' as const };
}
