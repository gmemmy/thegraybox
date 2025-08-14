export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const radii = {
  sm: 6,
  md: 12,
  lg: 16,
  full: 999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
} as const;

export type Spacing = typeof spacing;
export type Radii = typeof radii;
export type Shadows = typeof shadows;


