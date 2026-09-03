/**
 * `notion-compat` retains its original API response on `raw`; the renderer
 * consumes the normalized record-map fields instead. Do not serialize it.
 */
export function stripRecordMapRaw<T extends object>(recordMap: T): T {
  const { raw: _raw, ...renderableRecordMap } = recordMap as T & {
    raw?: unknown;
  };

  return renderableRecordMap as T;
}
