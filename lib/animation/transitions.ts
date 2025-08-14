type BoundsBuilder = {
  relative: () => BoundsBuilder;
  transform: () => BoundsBuilder;
  content: () => BoundsBuilder;
  contentFit: () => BoundsBuilder;
  build: (method?: unknown) => unknown;
};

type ProductTransitionOptions = {
  bounds: (id: string) => BoundsBuilder;
  activeBoundId: string;
  progress: number;
};

export const PRODUCT_TRANSITION = {
  OPEN_MS: 1000,
  CLOSE_MS: 700,
  SCALE_FROM: 0.55,
  TRANSLATE_Y: 42,
  OVERLAY_ALPHA: 0.15,
} as const;

export function productDetailsTransitionOptions() {
  return {
    headerShown: false,
    enableTransitions: true,
    screenStyleInterpolator: ({bounds, activeBoundId, progress}: ProductTransitionOptions) => {
      'worklet';
      const animatedBound = (bounds(activeBoundId))
        .relative()
        .transform()
        .content()
        .contentFit()
        .build();

      // Ease and compose only non-shared screen content + overlay
      const eased = 1 - (1 - progress) ** 3; // easeOutCubic
      const scale = PRODUCT_TRANSITION.SCALE_FROM + eased * (1 - PRODUCT_TRANSITION.SCALE_FROM);
      const translateY = (1 - eased) * PRODUCT_TRANSITION.TRANSLATE_Y;
      const overlayOpacity = eased * PRODUCT_TRANSITION.OVERLAY_ALPHA;

      return {
        [activeBoundId]: animatedBound,
        contentStyle: {
          opacity: eased,
          transform: [{translateY}, {scale}],
        },
        overlayStyle: {
          backgroundColor: 'black',
          opacity: overlayOpacity,
        },
      } as const;
    },
    transitionSpec: {
      open: {animation: 'timing', config: {duration: PRODUCT_TRANSITION.OPEN_MS}},
      close: {animation: 'timing', config: {duration: PRODUCT_TRANSITION.CLOSE_MS}},
    },
  } as const;
}
