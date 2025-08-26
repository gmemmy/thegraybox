export const ACCENT_COLORS = [
  '#4c1d95', // purple
  '#991b1b', // red
  '#f97316', // amber
  '#fb923c', // orange
  '#f43f5e', // rose
  '#10b981', // green
  '#84cc16', // lime
];

export function getAccentColor(seedA?: string, seedB?: string) {
  const key = `${seedA ?? ''}|${seedB ?? ''}`;
  if (!key) return ACCENT_COLORS[0];
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0; // 32-bit
  }
  return ACCENT_COLORS[Math.abs(hash) % ACCENT_COLORS.length];
}

export const ACCENT_OVERRIDES: Record<string, string> = {
  'nike-01.png': '#4c1d95',
  'nike-02.png': '#991b1b',
  'nike-03.png': '#f97316',
  'nike-04.png': '#dc2626',
  'nike-05.png': '#000000',
  // id-based fallbacks
  '1': '#4c1d95',
  '2': '#991b1b',
  '3': '#f97316',
  '4': '#dc2626',
  '5': '#000000',
};

export function getOverrideAccent(key?: string) {
  if (!key) return undefined;
  const base = key.split('/').pop() ?? key;
  return ACCENT_OVERRIDES[base];
}
