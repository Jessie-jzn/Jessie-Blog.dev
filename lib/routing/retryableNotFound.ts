/**
 * Avoid permanently caching a 404 that was caused by a temporary upstream
 * failure while generating an ISR page.
 */
export function retryableNotFound() {
  return {
    notFound: true as const,
    revalidate: 60,
  };
}
