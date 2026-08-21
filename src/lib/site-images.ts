import fs from 'node:fs';
import path from 'node:path';

const SITE_IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'site');
const EXTS = ['.webp', '.jpg', '.jpeg', '.png', '.avif', '.gif'];

export type LocalSiteImage = {
  slug: string;
  src: string;
};

function compareSlugOrder(a: string, b: string): number {
  const aMatch = a.match(/^(.*?)(\d+)$/);
  const bMatch = b.match(/^(.*?)(\d+)$/);
  if (aMatch && bMatch && aMatch[1] === bMatch[1]) {
    return Number(aMatch[2]) - Number(bMatch[2]);
  }
  return a.localeCompare(b);
}

/** Resolve a single downloaded site image path, or `null` if missing. */
export function resolveLocalSiteImage(slug: string): string | null {
  const safeSlug = slug?.trim().toLowerCase();
  if (!safeSlug) return null;

  for (const ext of EXTS) {
    const absolute = path.join(SITE_IMAGE_DIR, `${safeSlug}${ext}`);
    if (fs.existsSync(absolute)) {
      return `/images/site/${safeSlug}${ext}`;
    }
  }

  return null;
}

/** List downloaded site images whose slug starts with `prefix`, sorted naturally. */
export function listLocalSiteImages(prefix: string): LocalSiteImage[] {
  let entries: string[];
  try {
    entries = fs.readdirSync(SITE_IMAGE_DIR);
  } catch {
    return [];
  }

  const images: LocalSiteImage[] = [];

  for (const entry of entries) {
    const ext = path.extname(entry).toLowerCase();
    if (!EXTS.includes(ext)) continue;

    const slug = path.basename(entry, ext);
    if (!slug.startsWith(prefix)) continue;

    images.push({
      slug,
      src: `/images/site/${entry}`,
    });
  }

  return images.sort((a, b) => compareSlugOrder(a.slug, b.slug));
}
