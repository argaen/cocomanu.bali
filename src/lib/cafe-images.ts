import fs from 'node:fs';
import path from 'node:path';

const CAFE_IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'cafe');
const EXTS = ['.webp', '.jpg', '.jpeg', '.png', '.avif', '.gif'];
const cache = new Map<string, string | null>();

/** Stable filename slug for a cafe menu row (must match `scripts/download-cafe-images.mjs`). */
export function cafeMenuImageSlug(name: string, id: string): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';
  const shortId = id.replace(/-/g, '').slice(0, 8);
  return `${base}-${shortId}`;
}

export function resolveLocalCafeImage(slug: string): string {
  const safeSlug = slug?.trim();
  if (!safeSlug) return '';

  if (cache.has(safeSlug)) {
    return cache.get(safeSlug) ?? '';
  }

  for (const ext of EXTS) {
    const absolute = path.join(CAFE_IMAGE_DIR, `${safeSlug}${ext}`);
    if (fs.existsSync(absolute)) {
      const localPath = `/images/cafe/${safeSlug}${ext}`;
      cache.set(safeSlug, localPath);
      return localPath;
    }
  }

  cache.set(safeSlug, null);
  return '';
}
