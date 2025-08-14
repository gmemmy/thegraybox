export type Point = {x: number; y: number};

export function clamp(value: number, min: number, max: number): number {
  'worklet';
  return Math.max(min, Math.min(max, value));
}

export function lerp(a: number, b: number, t: number): number {
  'worklet';
  return a + (b - a) * t;
}
