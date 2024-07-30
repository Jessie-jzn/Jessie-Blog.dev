import SiteConfig from '../site.config';
import { getEnv } from '@/lib/util';

export const port = getEnv('PORT', '3000');
export const environment = process.env.NODE_ENV || 'development';
export const isDev = environment === 'development';

const host = isDev
  ? `http://localhost:${port}`
  : `https://${SiteConfig.domain}`;

export { host };
