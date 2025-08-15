import {useEffect} from 'react';
import {Dimensions, type EmitterSubscription, Keyboard} from 'react-native';
import {Gesture} from 'react-native-gesture-handler';
import {useDerivedValue, useSharedValue, withSpring} from 'react-native-reanimated';

import {
  BOTTOM_SHEET_RATIOS,
  BOTTOM_SHEET_SPRINGS,
  computeBottomSheetTargets,
  shouldCloseSheet,
} from '@/lib/animation/bottom-sheet';
import {selection} from '@/lib/haptics';

import type {GestureType} from 'react-native-gesture-handler';
import type {SharedValue} from 'react-native-reanimated';

export type OptionsSheetController = {
  present: () => void;
  dismiss: () => void;
  y: SharedValue<number>;
  progress: SharedValue<number>;
  openHeight: SharedValue<number>;
  screenHeight: number;
  mode: 'fixed' | 'detents';
  gesture: GestureType;
  onMeasureContent: (measuredHeight: number) => void;
};

export function useOptionsSheet(mode: 'fixed' | 'detents' = 'fixed'): OptionsSheetController {
  const screenHeight = Dimensions.get('window').height;

  const measuredHeight = useSharedValue(0);
  const keyboardHeight = useSharedValue(0);

  const minOpen = BOTTOM_SHEET_RATIOS.MIN_OPEN * screenHeight;
  const maxOpen = BOTTOM_SHEET_RATIOS.MAX_OPEN * screenHeight;
  const floorOpen = BOTTOM_SHEET_RATIOS.FLOOR_OPEN * screenHeight;

  const openHeight = useSharedValue(minOpen);

  const offscreenY = screenHeight + 48;
  const y = useSharedValue(offscreenY);
  const progress = useSharedValue(0);

  // Compute progress 0..1 → (screenH - y) / openHeight
  useDerivedValue(() => {
    const denom = Math.max(1, openHeight.value);
    const raw = (screenHeight - y.value) / denom;
    progress.value = Math.max(0, Math.min(1, raw));
  });

  // Keyboard handling
  useEffect(() => {
    const subs: EmitterSubscription[] = [];
    const onShow = (e: {endCoordinates?: {height?: number}} | undefined) => {
      keyboardHeight.value = e?.endCoordinates?.height ?? 0;
      const base = measuredHeight.value || minOpen;
      const reduced = Math.max(floorOpen, base - keyboardHeight.value);
      openHeight.value = Math.max(minOpen, Math.min(maxOpen, reduced));
    };
    const onHide = () => {
      keyboardHeight.value = 0;
      const base = measuredHeight.value || minOpen;
      openHeight.value = Math.max(minOpen, Math.min(maxOpen, base));
    };
    subs.push(Keyboard.addListener('keyboardWillShow', onShow));
    subs.push(Keyboard.addListener('keyboardWillHide', onHide));
    return () => {
      for (const s of subs) s.remove();
    };
  }, [floorOpen, keyboardHeight, maxOpen, measuredHeight, minOpen, openHeight]);

  const springOpen = BOTTOM_SHEET_SPRINGS.OPEN;
  const springClose = BOTTOM_SHEET_SPRINGS.CLOSE;

  function computeTargets() {
    'worklet';
    return computeBottomSheetTargets(screenHeight, openHeight.value, minOpen, maxOpen);
  }

  function animateTo(targetY: number, closing: boolean) {
    y.value = withSpring(targetY, closing ? springClose : springOpen);
  }

  function present() {
    const targets = computeTargets();
    selection();
    animateTo(targets.openY, false);
  }

  function dismiss() {
    const targets = computeTargets();
    animateTo(targets.closedY, true);
  }

  const startY = useSharedValue(0);
  const gesture = Gesture.Pan()
    .onBegin(() => {
      startY.value = y.value;
    })
    .onUpdate((e) => {
      const targets = computeTargets();
      const next = startY.value + e.translationY;
      y.value = Math.max(targets.openY, Math.min(targets.closedY, next));
    })
    .onEnd((e) => {
      const targets = computeTargets();
      const dragged = y.value - targets.openY; // >0 means downward
      const shouldClose = shouldCloseSheet(dragged, e.velocityY, screenHeight);
      y.value = withSpring(
        shouldClose ? targets.closedY : targets.openY,
        shouldClose ? springClose : springOpen,
      );
    });

  function onMeasureContent(h: number) {
    measuredHeight.value = h;
    const base = Math.max(minOpen, Math.min(maxOpen, h));
    const reduced = Math.max(floorOpen, base - keyboardHeight.value);
    openHeight.value = Math.max(minOpen, Math.min(maxOpen, reduced));
  }

  return {present, dismiss, y, progress, openHeight, screenHeight, mode, gesture, onMeasureContent};
}
