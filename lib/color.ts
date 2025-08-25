export const ACCENT_COLORS = [
  '#7c3aed', // purple
  '#ef4444', // red
  '#f59e0b', // amber
  '#fb923c', // orange
  '#f43f5e', // rose
  '#10b981', // emerald
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
  'nike-01.png': '#7c3aed',
  'nike-02.png': '#ef4444',
  'nike-03.png': '#f59e0b',
  'nike-04.png': '#ef4444',
  'nike-05.png': '#000000',
  // id-based fallbacks
  '1': '#7c3aed',
  '2': '#ef4444',
  '3': '#f59e0b',
  '4': '#ef4444',
  '5': '#000000',
};

export function getOverrideAccent(key?: string) {
  if (!key) return undefined;
  const base = key.split('/').pop() ?? key;
  return ACCENT_OVERRIDES[base];
}
