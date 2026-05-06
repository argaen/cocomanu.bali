import fs from 'node:fs';
import path from 'node:path';

const SHOP_IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'shop');
const EXTS = ['.webp', '.jpg', '.jpeg', '.png', '.avif', '.gif'];
const cache = new Map<string, string | null>();

export function resolveLocalShopImage(slug: string, fallback: string): string {
  const safeSlug = slug?.trim();
  if (!safeSlug) return fallback;

  if (cache.has(safeSlug)) {
    return cache.get(safeSlug) ?? fallback;
  }

  for (const ext of EXTS) {
    const absolute = path.join(SHOP_IMAGE_DIR, `${safeSlug}${ext}`);
    if (fs.existsSync(absolute)) {
      const localPath = `/images/shop/${safeSlug}${ext}`;
      cache.set(safeSlug, localPath);
      return localPath;
    }
  }

  cache.set(safeSlug, null);
  return fallback;
}
