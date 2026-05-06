/** Notion page id slug：去连字符并限制长度，用于 Redis key。 */
export function normalizeStatsPostId(raw: string | undefined | null): string {
  if (!raw) return "";
  const stripped = String(raw).replace(/-/g, "").toLowerCase();
  return stripped.replace(/[^a-f0-9]/gi, "").slice(0, 40);
}
