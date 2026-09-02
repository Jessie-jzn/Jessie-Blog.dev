type Prefetch = (href: string) => Promise<unknown>;

/**
 * Starts navigation data loading only after a visitor expresses intent to open
 * an article, avoiding viewport-wide prefetching on long article lists.
 */
export function createIntentPrefetch(prefetch: Prefetch, href: string) {
  let requested = false;

  return () => {
    if (requested) return;

    requested = true;
    void prefetch(href).catch(() => {
      requested = false;
    });
  };
}
