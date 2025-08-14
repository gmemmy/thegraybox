import type {WithSpringConfig} from 'react-native-reanimated';

export function iosLike(overrides: Partial<WithSpringConfig> = {}): WithSpringConfig {
  return {
    damping: 20,
    mass: 1,
    stiffness: 180,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
    ...overrides,
  } as WithSpringConfig;
}

export function gentle(overrides: Partial<WithSpringConfig> = {}): WithSpringConfig {
  return {
    damping: 18,
    mass: 1,
    stiffness: 120,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
    ...overrides,
  } as WithSpringConfig;
}
