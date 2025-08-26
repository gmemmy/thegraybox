import {useState} from 'react';
import {View} from 'react-native';
import {
  Easing,
  interpolate,
  measure,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {runOnJS, runOnUI} from 'react-native-worklets';

import {ADD_TO_BAG_OVERLAY, getOverlayConfig} from '@/lib/animation/overlay';
import {colors} from '@/theme/colors';

export function useAddToBagOverlay(accentColor?: string) {
  const forceBlur = useSharedValue(false);
  const showOverlay = useSharedValue(false);
  const [overlayVisible, setOverlayVisibleJS] = useState(false);

  useAnimatedReaction(
    () => showOverlay.value,
    (current, previous) => {
      if (current !== previous) runOnJS(setOverlayVisibleJS)(current);
    },
  );

  const overlayElementsStyle = useAnimatedStyle(
    () => ({opacity: showOverlay.value ? 1 : 0}) as const,
  );

  const overlayProgress = useSharedValue(0);
  const phase2Progress = useSharedValue(0);
  const circleFade = useSharedValue(1);
  const imageAlpha = useSharedValue(1);
  const fadeThreshold = useSharedValue(1);
  const circleAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      overlayProgress.value,
      [0, 1],
      [ADD_TO_BAG_OVERLAY.CIRCLE_START_SCALE, 1],
    );
    const baseOpacity = interpolate(
      overlayProgress.value,
      [0, 1],
      [ADD_TO_BAG_OVERLAY.CIRCLE_START_OPACITY, 1],
    );
    const opacity = baseOpacity * circleFade.value;
    return {transform: [{scale}], opacity} as const;
  });

  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const startW = useSharedValue(0);
  const startH = useSharedValue(0);
  const imageProgress = overlayProgress;

  const cfg = getOverlayConfig();
  const finalCircleDiameter = cfg.finalCircleDiameter;
  const finalImageSize = cfg.finalImageSize;
  const targetCenterX = cfg.targetCenterX;
  const targetCenterY = cfg.targetCenterY;
  const bottomTargetDiameter = 56;
  const bottomTargetOpacity = useSharedValue(0);
  const bottomTargetTranslateY = useSharedValue(0);
  const bottomTargetCenterY = useSharedValue(cfg.screenHeight);
  const isTargetGreen = useSharedValue(false);

  // Circle follows shoe during phase 2 using the same extra travel
  const circlePositionStyle = useAnimatedStyle(() => {
    const stopOffset = ADD_TO_BAG_OVERLAY.STOP_OFFSET_BEFORE_TARGET;
    const extraTravel = bottomTargetCenterY.value - targetCenterY - stopOffset;
    const translateY2 = interpolate(phase2Progress.value, [0, 1], [0, extraTravel]);
    return {transform: [{translateY: translateY2}]} as const;
  });

  // Ensure circle opacity fully reaches 0 just before the bottom element
  const circlePhase2FadeStyle = useAnimatedStyle(() => {
    const stopOffset = ADD_TO_BAG_OVERLAY.STOP_OFFSET_BEFORE_TARGET;
    const extraTravel = bottomTargetCenterY.value - targetCenterY - stopOffset;

    const FADE_START_RATIO = 0.4; // begin around 40% of phase 2
    const start =
      extraTravel <= 0
        ? FADE_START_RATIO
        : Math.max(
            0,
            Math.min(FADE_START_RATIO, (extraTravel - stopOffset * 0.5) / Math.max(1, extraTravel)),
          );
    const opacity = interpolate(phase2Progress.value, [0, start, 1], [1, 1, 0]);
    return {opacity} as const;
  });

  // Fade circle and hide shoe near threshold
  useAnimatedReaction(
    () => ({p: phase2Progress.value, th: fadeThreshold.value}),
    (v) => {
      if (v.p >= v.th) {
        imageAlpha.value = withTiming(0, {duration: 140});
        circleFade.value = withTiming(0, {duration: 180});
      }
    },
  );

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const toX = targetCenterX - finalImageSize / 2;
    const toY = targetCenterY - finalImageSize / 2;
    const translateX = interpolate(imageProgress.value, [0, 1], [0, toX - startX.value]);
    const translateY1 = interpolate(imageProgress.value, [0, 1], [0, toY - startY.value]);
    const stopOffset = 36;
    const extraTravel = bottomTargetCenterY.value - targetCenterY - stopOffset;
    const translateY2 = interpolate(phase2Progress.value, [0, 1], [0, extraTravel]);
    const scaleX = interpolate(
      imageProgress.value,
      [0, 1],
      [1, finalImageSize / Math.max(1, startW.value)],
    );
    const scaleY = interpolate(
      imageProgress.value,
      [0, 1],
      [1, finalImageSize / Math.max(1, startH.value)],
    );
    return {
      left: startX.value,
      top: startY.value,
      width: startW.value,
      height: startH.value,
      position: 'absolute',
      opacity: imageAlpha.value,
      transform: [{translateX}, {translateY: translateY1 + translateY2}, {scaleX}, {scaleY}],
    } as const;
  });

  // @ts-expect-error broad ref typing across versions
  const headerImageRef = useAnimatedRef(View);

  function startPhase1(onLocked: () => void) {
    // Reset state so the sequence is repeatable
    forceBlur.value = true;
    showOverlay.value = true;
    overlayProgress.value = 0;
    phase2Progress.value = 0;
    circleFade.value = 1;
    imageAlpha.value = 1;
    bottomTargetOpacity.value = 0;
    bottomTargetTranslateY.value = 0;
    isTargetGreen.value = false;

    runOnUI(() => {
      'worklet';
      const m = measure(headerImageRef);
      if (m) {
        startX.value = m.pageX;
        startY.value = m.pageY;
        startW.value = m.width;
        startH.value = m.height;
      }
    })();

    overlayProgress.value = withTiming(
      1,
      {duration: ADD_TO_BAG_OVERLAY.DURATION_MS, easing: Easing.inOut(Easing.cubic)},
      () => {
        bottomTargetOpacity.value = withTiming(1, {duration: 220});
        runOnJS(onLocked)();
      },
    );
  }

  function startPhase2(params: {bottomInset: number; onDone: () => void}) {
    const centerY = cfg.screenHeight - params.bottomInset - 20 - bottomTargetDiameter / 2;
    bottomTargetCenterY.value = centerY;
    // Hide shoe near the end using worklet threshold check inside timing callback chain
    const totalExtra = centerY - targetCenterY - ADD_TO_BAG_OVERLAY.STOP_OFFSET_BEFORE_TARGET;
    const threshold =
      totalExtra <= 0 ? 0.9 : Math.max(0.1, (totalExtra - 36) / Math.max(1, totalExtra));
    fadeThreshold.value = threshold;
    phase2Progress.value = 0;
    phase2Progress.value = withTiming(
      1,
      {duration: ADD_TO_BAG_OVERLAY.PHASE2_DURATION_MS, easing: Easing.out(Easing.cubic)},
      () => {
        isTargetGreen.value = true;
        bottomTargetTranslateY.value = withTiming(ADD_TO_BAG_OVERLAY.TARGET_FADE_DOWN_PX, {
          duration: ADD_TO_BAG_OVERLAY.TARGET_FADE_OUT_MS,
        });
        bottomTargetOpacity.value = withTiming(
          0,
          {duration: ADD_TO_BAG_OVERLAY.TARGET_FADE_OUT_MS},
          () => {
            forceBlur.value = false;
            showOverlay.value = false;
            runOnJS(params.onDone)();
          },
        );
      },
    );
  }

  function runSequence(params: {bottomInset: number; onDone: () => void}) {
    startPhase1(() => {
      startPhase2({bottomInset: params.bottomInset, onDone: params.onDone});
    });
  }

  return {
    forceBlur,
    showOverlay,
    overlayVisible,
    overlayElementsStyle,
    circleAnimatedStyle,
    circlePositionStyle,
    circlePhase2FadeStyle,
    imageAnimatedStyle,
    headerImageRef,
    startPhase1,
    startPhase2,
    runSequence,
    setOverlayVisibleJS,
    config: {
      finalCircleDiameter,
      finalImageSize,
      targetCenterX,
      targetCenterY,
      bottomTargetDiameter,
      getBottomTargetTop: (bottomInset: number) =>
        centerToTop(cfg.screenHeight - bottomInset - 20, bottomTargetDiameter),
    },
    bottomTarget: {
      opacityStyle: useAnimatedStyle(() => ({opacity: bottomTargetOpacity.value}) as const),
      translateStyle: useAnimatedStyle(
        () => ({transform: [{translateY: bottomTargetTranslateY.value}]}) as const,
      ),
      colorStyle: useAnimatedStyle(
        () =>
          ({
            backgroundColor: isTargetGreen.value ? colors.success : accentColor || '#10b981',
          }) as const,
      ),
      positionStyle: useAnimatedStyle(
        () => ({top: bottomTargetCenterY.value - bottomTargetDiameter / 2}) as const,
      ),
      outlineIconOpacity: useAnimatedStyle(() => ({opacity: isTargetGreen.value ? 0 : 1}) as const),
      filledIconOpacity: useAnimatedStyle(() => ({opacity: isTargetGreen.value ? 1 : 0}) as const),
      isGreen: isTargetGreen,
    },
  } as const;
}

function centerToTop(centerY: number, diameter: number) {
  'worklet';
  return centerY - diameter / 2;
}
