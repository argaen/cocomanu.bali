import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';
import { Client } from '@notionhq/client';

const PRODUCTS_DB_ID = process.env.NOTION_PRODUCTS_DB_ID || '330452d3e01380729ae7e83bf18c7a5f';
const OUTPUT_DIR = path.resolve(process.cwd(), 'public/images/shop');
const NOTION_TOKEN = process.env.NOTION_TOKEN;

if (!NOTION_TOKEN) {
  throw new Error('Missing NOTION_TOKEN env var.');
}

function createNodeFetch() {
  return async function nodeFetch(url, init = {}) {
    const method = init.method || 'GET';
    const rawHeaders = init.headers || {};
    const headers = {};
    for (const [key, value] of Object.entries(rawHeaders)) {
      headers[key] = String(value);
    }
    const body = init.body ? String(init.body) : undefined;
    const target = new URL(String(url));
    const client = target.protocol === 'https:' ? https : http;

    const result = await new Promise((resolve, reject) => {
      const request = client.request(
        {
          protocol: target.protocol,
          hostname: target.hostname,
          port: target.port || undefined,
          path: `${target.pathname}${target.search}`,
          method,
          headers,
        },
        (response) => {
          const chunks = [];
          response.on('data', (chunk) => chunks.push(chunk));
          response.on('end', () => {
            const buffer = Buffer.concat(chunks);
            resolve({
              status: response.statusCode || 0,
              statusText: response.statusMessage || '',
              headers: response.headers,
              buffer,
            });
          });
        },
      );
      request.on('error', reject);
      if (body) request.write(body);
      request.end();
    });

    const textBody = result.buffer.toString('utf8');
    return {
      ok: result.status >= 200 && result.status < 300,
      status: result.status,
      statusText: result.statusText,
      headers: {
        get(name) {
          const value = result.headers[String(name).toLowerCase()];
          if (Array.isArray(value)) return value.join(', ');
          return value || null;
        },
      },
      text: async () => textBody,
      json: async () => (textBody ? JSON.parse(textBody) : {}),
    };
  };
}

const notion = new Client({
  auth: NOTION_TOKEN,
  fetch: typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : createNodeFetch(),
});

function sanitizeSlug(slug) {
  return slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-');
}

function fileExtensionFromUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    const ext = path.extname(parsed.pathname).toLowerCase();
    if (ext) return ext;
  } catch {
    // noop
  }
  return '.jpg';
}

function fileExtensionFromContentType(contentType) {
  if (!contentType) return '';
  if (contentType.includes('image/png')) return '.png';
  if (contentType.includes('image/webp')) return '.webp';
  if (contentType.includes('image/gif')) return '.gif';
  if (contentType.includes('image/svg+xml')) return '.svg';
  if (contentType.includes('image/jpeg')) return '.jpg';
  return '';
}

function downloadToFile(url, targetPath, redirectCount = 0) {
  const client = url.startsWith('https:') ? https : http;

  return new Promise((resolve, reject) => {
    const request = client.get(url, (response) => {
      if (
        response.statusCode
        && response.statusCode >= 300
        && response.statusCode < 400
        && response.headers.location
      ) {
        if (redirectCount > 5) {
          reject(new Error(`Too many redirects for ${url}`));
          return;
        }
        const redirected = new URL(response.headers.location, url).toString();
        resolve(downloadToFile(redirected, targetPath, redirectCount + 1));
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url} (status ${response.statusCode ?? 'unknown'})`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', async () => {
        try {
          const contentType = response.headers['content-type'] || '';
          const typeExt = fileExtensionFromContentType(String(contentType).toLowerCase());
          const finalPath = typeExt
            ? targetPath.replace(/\.[^.]+$/, typeExt)
            : targetPath;
          await fs.writeFile(finalPath, Buffer.concat(chunks));
          resolve(finalPath);
        } catch (error) {
          reject(error);
        }
      });
    });

    request.on('error', reject);
  });
}

function getSlugFromPage(page) {
  const prop = page.properties?.Slug;
  if (!prop) return '';
  if (prop.type === 'formula') return prop.formula?.string || '';
  if (prop.type === 'rich_text') return (prop.rich_text?.[0]?.plain_text || '').trim();
  return '';
}

function getNameFromPage(page) {
  const prop = page.properties?.Name;
  if (!prop || prop.type !== 'title' || !Array.isArray(prop.title)) return '';
  return (prop.title[0]?.plain_text || '').trim();
}

function getPhotoUrlFromPage(page) {
  const prop = page.properties?.Photo;
  if (!prop || prop.type !== 'files' || !Array.isArray(prop.files) || prop.files.length === 0) return '';
  const first = prop.files[0];
  return first.external?.url || first.file?.url || '';
}

async function fetchAllProducts() {
  const pages = [];
  let cursor;

  while (true) {
    const response = await notion.databases.query({
      database_id: PRODUCTS_DB_ID,
      start_cursor: cursor,
      page_size: 100,
      sorts: [{ property: 'Name', direction: 'ascending' }],
    });
    pages.push(...response.results);
    if (!response.has_more || !response.next_cursor) break;
    cursor = response.next_cursor;
  }

  return pages;
}

function slugFromFilename(filename) {
  return path.basename(filename, path.extname(filename));
}

async function removeOrphanShopImages(validSlugs) {
  let removed = 0;
  let entries;
  try {
    entries = await fs.readdir(OUTPUT_DIR);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return 0;
    }
    throw error;
  }

  for (const entry of entries) {
    const fullPath = path.join(OUTPUT_DIR, entry);
    const stat = await fs.stat(fullPath);
    if (!stat.isFile()) continue;

    const slug = slugFromFilename(entry);
    if (!validSlugs.has(slug)) {
      await fs.unlink(fullPath);
      removed += 1;
      console.log(`Removed orphan ${path.relative(process.cwd(), fullPath)}`);
    }
  }

  return removed;
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const pages = await fetchAllProducts();
  const validSlugs = new Set();
  let downloaded = 0;
  const skippedEntries = [];

  for (const page of pages) {
    const rawSlug = getSlugFromPage(page);
    const slug = sanitizeSlug(rawSlug);
    if (slug) validSlugs.add(slug);
  }

  const removed = await removeOrphanShopImages(validSlugs);
  if (removed > 0) {
    console.log(`Removed ${removed} image(s) with no matching Notion slug.\n`);
  }

  for (const page of pages) {
    const rawSlug = getSlugFromPage(page);
    const slug = sanitizeSlug(rawSlug);
    const imageUrl = getPhotoUrlFromPage(page);
    const name = getNameFromPage(page);
    const label = slug || name || page.id;

    if (!slug) {
      skippedEntries.push({ label, reason: 'missing slug' });
      continue;
    }
    if (!imageUrl) {
      skippedEntries.push({ label: slug, reason: 'missing photo' });
      continue;
    }

    const baseExt = fileExtensionFromUrl(imageUrl);
    const targetPath = path.join(OUTPUT_DIR, `${slug}${baseExt}`);

    try {
      const finalPath = await downloadToFile(imageUrl, targetPath);
      downloaded += 1;
      console.log(`Downloaded ${slug} -> ${path.relative(process.cwd(), finalPath)}`);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      skippedEntries.push({ label: slug, reason });
    }
  }

  if (skippedEntries.length > 0) {
    console.log('\nSkipped items:');
    for (const entry of skippedEntries) {
      console.log(`  - ${entry.label} (${entry.reason})`);
    }
  }

  console.log(`\nDone. Downloaded: ${downloaded}, Removed orphans: ${removed}, Skipped: ${skippedEntries.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
