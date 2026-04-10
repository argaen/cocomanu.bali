import { NextResponse } from 'next/server';

import { getPlantDetail } from '@/lib/notion';

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: 'Missing plant slug' }, { status: 400 });
  }

  try {
    const detail = await getPlantDetail(slug);
    if (!detail) {
      return NextResponse.json({ error: 'Plant not found' }, { status: 404 });
    }
    return NextResponse.json(detail);
  } catch {
    return NextResponse.json({ error: 'Failed to load plant details' }, { status: 500 });
  }
}
