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

/**
 * Computes the target positions for the bottom sheet.
 *
 * This function calculates the positions where the bottom sheet should be when
 * it is open and when it is closed. It clamps the open height within the given
 * minimum and maximum limits.
 *
 * @param {number} screenHeight - The height of the screen.
 * @param {number} openHeight - The desired open height of the bottom sheet.
 * @param {number} minOpen - The minimum allowed open height.
 * @param {number} maxOpen - The maximum allowed open height.
 * @returns {{openY: number, closedY: number}} An object with the computed open and closed Y positions.
 */
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

/**
 * Determines if the bottom sheet should be closed based on the drag distance and velocity.
 *
 * This function uses a threshold computed as a percentage of the screen height to decide whether
 * the dragged distance or the drag velocity is sufficient to trigger the closing of the bottom sheet.
 *
 * @param {number} dragged - The distance that the bottom sheet has been dragged.
 * @param {number} velocityY - The vertical velocity of the drag.
 * @param {number} screenHeight - The height of the screen.
 * @returns {boolean} True if the sheet should be closed, otherwise false.
 */
export function shouldCloseSheet(
  dragged: number,
  velocityY: number,
  screenHeight: number,
): boolean {
  'worklet';
  const threshold = GESTURE_THRESHOLDS.DRAG_THRESHOLD * screenHeight;
  return dragged > threshold || velocityY > GESTURE_THRESHOLDS.VELOCITY_THRESHOLD;
}

/**
 * Determines if the bottom sheet should be opened based on the drag distance and velocity.
 *
 * This function evaluates whether the drag distance or velocity exceeds certain thresholds
 * to decide if the bottom sheet should open.
 *
 * @param {number} dragged - The distance that the bottom sheet has been dragged.
 * @param {number} velocityY - The vertical velocity of the drag.
 * @param {number} screenHeight - The height of the screen.
 * @returns {boolean} True if the sheet should be opened, otherwise false.
 */
export function shouldOpenSheet(dragged: number, velocityY: number, screenHeight: number): boolean {
  'worklet';
  const threshold = GESTURE_THRESHOLDS.DRAG_THRESHOLD * screenHeight;
  return dragged > threshold || velocityY > GESTURE_THRESHOLDS.CARD_VELOCITY_THRESHOLD;
}
