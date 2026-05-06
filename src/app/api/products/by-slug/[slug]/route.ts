import { NextResponse } from 'next/server';

import { getProductDetail } from '@/lib/notion';
import { resolveLocalShopImage } from '@/lib/shop-images';

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: 'Missing product slug' }, { status: 400 });
  }

  try {
    const detail = await getProductDetail(slug);
    detail.product.image = resolveLocalShopImage(detail.product.slug, detail.product.image);
    return NextResponse.json(detail);
  } catch {
    return NextResponse.json({ error: 'Failed to load product details' }, { status: 500 });
  }
}
