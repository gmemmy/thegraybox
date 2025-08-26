import {Dimensions} from 'react-native';

import {clamp} from './geometry';

export const ADD_TO_BAG_OVERLAY = {
  DURATION_MS: 820,
  CIRCLE_START_SCALE: 2.8,
  CIRCLE_START_OPACITY: 0.6,
  FINAL_CIRCLE_DIAMETER: 128,
  FINAL_IMAGE_SIZE: 92,
  TARGET_Y_RATIO: 0.36, // percentage from top (closer to action)
  TARGET_Y_OFFSET: -40, // pixel offset to shift circle upward
  MIN_TOP_MARGIN: 24, // ensure circle stays in viewport
  BOTTOM_MARGIN: 140, // keep clear of bottom elements
  STOP_OFFSET_BEFORE_TARGET: 36,
  PHASE2_DURATION_MS: 680,
  TARGET_FADE_IN_MS: 220,
  TARGET_FADE_OUT_MS: 220,
  TARGET_FADE_DOWN_PX: 20,
  BOTTOM_TARGET_DIAMETER: 56,
  CIRCLE_FADE_START_RATIO: 0.4,
} as const;

export function getOverlayConfig() {
  'worklet';
  const {width, height} = Dimensions.get('window');
  const targetCenterX = width / 2;
  const baseY = height * ADD_TO_BAG_OVERLAY.TARGET_Y_RATIO + ADD_TO_BAG_OVERLAY.TARGET_Y_OFFSET;
  const r = ADD_TO_BAG_OVERLAY.FINAL_CIRCLE_DIAMETER / 2;
  const minY = r + ADD_TO_BAG_OVERLAY.MIN_TOP_MARGIN;
  const maxY = height - r - ADD_TO_BAG_OVERLAY.BOTTOM_MARGIN;
  const targetCenterY = clamp(baseY, minY, maxY);
  return {
    screenWidth: width,
    screenHeight: height,
    targetCenterX,
    targetCenterY,
    finalCircleDiameter: ADD_TO_BAG_OVERLAY.FINAL_CIRCLE_DIAMETER,
    finalImageSize: ADD_TO_BAG_OVERLAY.FINAL_IMAGE_SIZE,
  } as const;
}
