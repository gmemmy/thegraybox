import {withDelay, withRepeat, withSequence, withTiming, Easing} from 'react-native-reanimated';
import type {SharedValue} from 'react-native-reanimated';

export function createBounceAnimation(
  sharedValue: SharedValue<number>,
  config: {
    delay?: number;
    duration?: number;
    offset?: number;
    cycles?: number;
    easing?: 'out' | 'in' | 'inOut';
  } = {},
) {
  const {delay = 0, duration = 450, offset = 8, cycles = 3, easing = 'out'} = config;

  const easingFn =
    easing === 'out'
      ? Easing.out(Easing.quad)
      : easing === 'in'
        ? Easing.in(Easing.quad)
        : Easing.inOut(Easing.quad);

  sharedValue.value = withDelay(
    delay,
    withRepeat(
      withSequence(
        withTiming(-offset, {duration, easing: easingFn}),
        withTiming(0, {duration, easing: easingFn}),
      ),
      cycles,
      false,
    ),
  );
}

export function createScaleAnimation(
  sharedValue: SharedValue<number>,
  config: {
    delay?: number;
    duration?: number;
    from?: number;
    to?: number;
    easing?: 'out' | 'in' | 'inOut';
  } = {},
) {
  const {delay = 0, duration = 320, from = 0.9, to = 1, easing = 'out'} = config;

  const easingFn =
    easing === 'out'
      ? Easing.out(Easing.cubic)
      : easing === 'in'
        ? Easing.in(Easing.cubic)
        : Easing.inOut(Easing.cubic);

  sharedValue.value = withDelay(delay, withTiming(to, {duration, easing: easingFn}));
}

export function createSwingAnimation(
  sharedValue: SharedValue<number>,
  config: {
    angle?: number;
    duration?: number;
    cycles?: number;
  } = {},
) {
  const {angle = 8, duration = 120, cycles = 3} = config;

  const swingSequence = Array.from({length: cycles * 2}, (_, i) => {
    const swingAngle = i % 2 === 0 ? -angle : angle;
    return withTiming(swingAngle, {duration});
  });

  sharedValue.value = withSequence(...swingSequence, withTiming(0, {duration}));
}
