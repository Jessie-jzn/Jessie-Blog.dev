export function preserveArticlePageOnTransientFailure(error: unknown): never {
  if (error instanceof Error) {
    throw error;
  }

  throw new Error("Failed to generate article page", { cause: error });
}
