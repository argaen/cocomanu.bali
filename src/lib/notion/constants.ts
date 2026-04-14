import gardenWebp from '@/assets/images/garden.webp';
export const GARDEN_IMAGE = gardenWebp;

export const COLOR_MAP: { [color: string]: string } = {
  brown: '#a52a2acc',
  green: '#928E43',
  pink: '#dc93b2',
  orange: '#ffa500dd',
  blue: '#6C9396',
  purple: '#800080cc',
  default: '#a52a2acc',
  yellow: '#D6AC42',
  red: '#C77743',
};

export const DATABASES = {
  posts: '139452d3e01380969e3edd1c8b5ca44a',
  plants: '13b452d3e01380ef9d46c2993f288622',
  products: '330452d3e01380729ae7e83bf18c7a5f',
  'cowork-pricing': '342452d3e01380969092eb4339cd6e9d',
  'colive-pricing': '342452d3e01380a1a1f9f707c4292770',
} as const;

/** WhatsApp number for `wa.me` links: digits only, no `+` (+62 812-2987-0979). */
export const WHATSAPP_PHONE_WA_ME = '6281229870979';