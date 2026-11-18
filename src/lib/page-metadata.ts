import type { Metadata } from 'next';

const OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'Cocomanu logo',
} as const;

export function pageMetadata({
  title,
  description,
  path,
  keywords,
}: {
  title: string;
  description: string;
  /** Pathname only, e.g. `/cowork`. */
  path: string;
  keywords?: string[];
}): Metadata {
  return {
    title,
    description,
    keywords,
    robots: {
      index: false,
    },
    openGraph: {
      title,
      description,
      url: path,
      type: 'website',
      siteName: 'Cocomanu',
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/twitter-image'],
    },
  };
}
