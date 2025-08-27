import {useCallback} from 'react';
import {Gesture} from 'react-native-gesture-handler';
import {useAnimatedStyle, useSharedValue, withSpring, withTiming} from 'react-native-reanimated';

export const CARD_PERSPECTIVE = 600;
export const MAX_TILT_DEG = 8;
export const PRESS_SCALE = 1.02;
export const GLOW_OPACITY_ACTIVE = 0.28;
export const GLOW_FADE_IN_MS = 120;
export const RESET_DURATION_MS = 180;
export const TAIL_SMOOTHING = 0.85; // 0..1 smoothing for trailing glow
export const HEAD_RADIUS = 84;
export const TAIL_RADIUS = 56;

/**
 * Provides gesture + animated styles for the gallery card tilt and glow effects.
 * Returns the pan gesture, an onLayout handler to measure card size, and styles.
 */
export function useGalleryCardInteraction() {
  const scale = useSharedValue(1);
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const glowX = useSharedValue(0);
  const glowY = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const cardW = useSharedValue(1);
  const cardH = useSharedValue(1);
  const tailX = useSharedValue(0);
  const tailY = useSharedValue(0);

  const onLayout = useCallback(
    (w: number, h: number) => {
      cardW.value = w;
      cardH.value = h;
    },
    [cardW, cardH],
  );

  const gesture = Gesture.Pan()
    .onBegin((e) => {
      scale.value = withSpring(PRESS_SCALE);
      glowOpacity.value = withTiming(GLOW_OPACITY_ACTIVE, {duration: GLOW_FADE_IN_MS});
      glowX.value = e.x;
      glowY.value = e.y;
      tailX.value = e.x;
      tailY.value = e.y;
    })
    .onUpdate((e) => {
      const nx = (e.x / Math.max(1, cardW.value)) * 2 - 1;
      const ny = (e.y / Math.max(1, cardH.value)) * 2 - 1;
      rotateY.value = nx * MAX_TILT_DEG;
      rotateX.value = -ny * MAX_TILT_DEG;
      glowX.value = e.x;
      glowY.value = e.y;
      const follow = 1 - TAIL_SMOOTHING;
      tailX.value = tailX.value * TAIL_SMOOTHING + e.x * follow;
      tailY.value = tailY.value * TAIL_SMOOTHING + e.y * follow;
    })
    .onEnd(() => {
      scale.value = withSpring(1);
      rotateX.value = withTiming(0, {duration: RESET_DURATION_MS});
      rotateY.value = withTiming(0, {duration: RESET_DURATION_MS});
      glowOpacity.value = withTiming(0, {duration: RESET_DURATION_MS});
    })
    .onFinalize(() => {
      scale.value = withSpring(1);
      rotateX.value = withTiming(0, {duration: RESET_DURATION_MS});
      rotateY.value = withTiming(0, {duration: RESET_DURATION_MS});
      glowOpacity.value = withTiming(0, {duration: RESET_DURATION_MS});
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      {perspective: CARD_PERSPECTIVE},
      {rotateX: `${rotateX.value}deg`},
      {rotateY: `${rotateY.value}deg`},
      {scale: scale.value},
    ],
    shadowOpacity: 0.08 + (1 - scale.value) * 0.2,
    shadowRadius: 12 + (1 - scale.value) * 8,
    elevation: 2 + (1 - scale.value) * 6,
  }));

  const headGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{translateX: glowX.value - HEAD_RADIUS}, {translateY: glowY.value - HEAD_RADIUS}],
  }));
  const tailGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value * 0.8,
    transform: [{translateX: tailX.value - TAIL_RADIUS}, {translateY: tailY.value - TAIL_RADIUS}],
  }));

  return {
    gesture,
    onLayout,
    styles: {
      cardStyle,
      headGlowStyle,
      tailGlowStyle,
    },
  } as const;
}
