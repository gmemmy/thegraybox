import {iosLike, gentle} from './springs';

export const BOTTOM_SHEET_RATIOS = {
  MIN_OPEN: 0.56, // 56% of screen height
  MAX_OPEN: 0.88, // 88% of screen height
  FLOOR_OPEN: 0.4, // 40% of screen height (minimum when keyboard is open)
} as const;

export const GESTURE_THRESHOLDS = {
  DRAG_THRESHOLD: 0.15, // 15% of screen height
  VELOCITY_THRESHOLD: 1200, // velocity to trigger close
  CARD_VELOCITY_THRESHOLD: 800, // velocity to trigger open from card
} as const;

export const BOTTOM_SHEET_SPRINGS = {
  OPEN: iosLike(),
  CLOSE: gentle(),
} as const;

export const ANIMATION_TIMING = {
  SCALE_DURATION: 320,
  START_DELAY: 120,
  BOUNCE_DURATION: 450,
  BOUNCE_CYCLES: 3,
  BOUNCE_OFFSET: 8,
} as const;

export function computeBottomSheetTargets(
  screenHeight: number,
  openHeight: number,
  minOpen: number,
  maxOpen: number,
) {
  'worklet';
  const clampedOpen = Math.max(minOpen, Math.min(maxOpen, openHeight));
  const openY = screenHeight - clampedOpen;
  const closedY = screenHeight;
  return {openY, closedY};
}

export function shouldCloseSheet(
  dragged: number,
  velocityY: number,
  screenHeight: number,
): boolean {
  'worklet';
  const threshold = GESTURE_THRESHOLDS.DRAG_THRESHOLD * screenHeight;
  return dragged > threshold || velocityY > GESTURE_THRESHOLDS.VELOCITY_THRESHOLD;
}

export function shouldOpenSheet(dragged: number, velocityY: number, screenHeight: number): boolean {
  'worklet';
  const threshold = GESTURE_THRESHOLDS.DRAG_THRESHOLD * screenHeight;
  return dragged > threshold || velocityY > GESTURE_THRESHOLDS.CARD_VELOCITY_THRESHOLD;
}
