import { baiduTranslate } from './baidu/baiduTranslate';

const cache: { [key: string]: string } = {};

export async function getTranslation(text: string, from: string, to: string): Promise<string> {
  const cacheKey = `${text}_${from}_${to}`;
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  const translation = await baiduTranslate(text, from, to);
  cache[cacheKey] = translation;
  return translation;
}