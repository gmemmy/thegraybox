export const openSheet = () => {};
export const closeSheet = () => {};
export const presentModal = () => {};
export const dismissModal = () => {};

// Expo Router passes params as string | string[] | undefined.
// This helper normalizes a param to a string if present.
export function normalizeParam(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return typeof value[0] === 'string' ? (value[0] as string) : undefined;
  return undefined;
}

export function parseNumber(value: unknown): number | undefined {
  const str = normalizeParam(value);
  if (str === null || str === undefined) return undefined;
  const n = Number(str);
  return Number.isFinite(n) ? n : undefined;
}
