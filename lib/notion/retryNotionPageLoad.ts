export async function retryNotionPageLoad<T>(
  load: () => Promise<T>,
  attempts = 3,
  retryDelayMs = 250
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await load();
    } catch (error) {
      lastError = error;
      if (attempt + 1 < attempts && retryDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    }
  }

  throw lastError;
}
