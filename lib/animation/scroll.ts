export function rubberband(distance: number, dimension: number, constant = 0.55): number {
  'worklet';
  if (distance < 0) return -rubberband(-distance, dimension, constant);
  const result = (1 - 1 / ((distance * constant) / dimension + 1)) * dimension;
  return result;
}
