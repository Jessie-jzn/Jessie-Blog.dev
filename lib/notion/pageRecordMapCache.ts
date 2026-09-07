import {
  createPromiseCache,
  getGlobalPromiseCache,
  type PromiseCache,
  type PromiseCacheOptions,
} from "./promiseCache.ts";

export interface PageRecordMapCache<T> {
  getOrCreate(pageId: string, loader: () => Promise<T>): Promise<T>;
  clear(): void;
}

const DEFAULT_PAGE_RECORD_MAP_CACHE_TTL_MS = 15 * 60 * 1000;

function cacheOptions(options: PromiseCacheOptions = {}): PromiseCacheOptions {
  return {
    ...options,
    ttlMs: options.ttlMs ?? DEFAULT_PAGE_RECORD_MAP_CACHE_TTL_MS,
  };
}

function wrapCache<T>(
  cache: PromiseCache<string, T>,
  options: PromiseCacheOptions = {}
): PageRecordMapCache<T> {
  return {
    getOrCreate(pageId, loader) {
      return cache.getOrCreate(pageId, loader, cacheOptions(options));
    },
    clear() {
      cache.clear();
    },
  };
}

export function createPageRecordMapCache<T>(
  options: PromiseCacheOptions = {}
): PageRecordMapCache<T> {
  return wrapCache(createPromiseCache<string, T>(), options);
}

export function getGlobalPageRecordMapCache<T>(): PageRecordMapCache<T> {
  return wrapCache(
    getGlobalPromiseCache<string, T>("notion-page-record-map")
  );
}
