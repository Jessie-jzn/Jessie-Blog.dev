export async function retryNotionPageLoad<T>(
  load: () => Promise<T>,
  attempts = 2
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await load();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}
