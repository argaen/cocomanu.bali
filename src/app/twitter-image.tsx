import { ImageResponse } from 'next/og';

import Logo from '@/components/svg/Logo';

export const runtime = 'edge';
export const contentType = 'image/png';
export const size = {
  width: 1200,
  height: 630,
};
export const alt = 'Cocomanu logo';

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f6f3eb',
          padding: '48px',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '420px',
            height: '420px',
          }}
        >
          <Logo />
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
