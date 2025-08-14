export const colors = {
  background: '#ffffff',
  backgroundDark: '#000000',
  foreground: '#111111',
  muted: '#f1f1f1',
  primary: '#0EA5E9',
  border: '#e5e5e5',
  nike: {
    purple: '#7c3aed',
    orange: '#ff6b35',
    black: '#111111',
    gray: '#6b7280',
    lightGray: '#f1f2f6',
    red: '#ef4444',
  },
} as const;

export type Colors = typeof colors;
