export interface PromiseCache<K, V> {
  getOrCreate(
    key: K,
    loader: () => Promise<V>,
    options?: PromiseCacheOptions
  ): Promise<V>;
  clear(): void;
}

export interface PromiseCacheOptions {
  ttlMs?: number;
  now?: () => number;
}

interface PromiseCacheEntry<V> {
  promise: Promise<V>;
  settled: boolean;
  expiresAt: number;
}

export function createPromiseCache<K, V>(): PromiseCache<K, V> {
  const values = new Map<K, PromiseCacheEntry<V>>();

  return {
    getOrCreate(
      key: K,
      loader: () => Promise<V>,
      options: PromiseCacheOptions = {}
    ): Promise<V> {
      const now = options.now ?? Date.now;
      const existing = values.get(key);
      if (
        existing &&
        (!existing.settled || now() < existing.expiresAt)
      ) {
        return existing.promise;
      }

      const entry: PromiseCacheEntry<V> = {
        promise: Promise.resolve(undefined as V),
        settled: false,
        expiresAt: Number.POSITIVE_INFINITY,
      };
      const ttlMs = options.ttlMs ?? Number.POSITIVE_INFINITY;
      entry.promise = loader()
        .then((value) => {
          entry.settled = true;
          entry.expiresAt = now() + ttlMs;
          return value;
        })
        .catch((error) => {
          if (values.get(key) === entry) {
            values.delete(key);
          }
          throw error;
        });
      values.set(key, entry);
      return entry.promise;
    },
    clear() {
      values.clear();
    },
  };
}

const globalCacheRegistryKey = Symbol.for(
  "jessie-blog.notions.promise-cache-registry"
);

export function getGlobalPromiseCache<K, V>(
  namespace: string
): PromiseCache<K, V> {
  const globalScope = globalThis as typeof globalThis & {
    [globalCacheRegistryKey]?: Map<string, PromiseCache<unknown, unknown>>;
  };
  const registry =
    globalScope[globalCacheRegistryKey] ??
    new Map<string, PromiseCache<unknown, unknown>>();
  globalScope[globalCacheRegistryKey] = registry;

  const existing = registry.get(namespace);
  if (existing) {
    return existing as PromiseCache<K, V>;
  }

  const cache = createPromiseCache<K, V>();
  registry.set(
    namespace,
    cache as PromiseCache<unknown, unknown>
  );
  return cache;
}
