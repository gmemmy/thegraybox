// We do this to avoid deep imports from react-native-screen-transitions, this is a shallow type setup
type BoundsBuilder = {
  gestures: (options?: { x?: number; y?: number }) => BoundsBuilder;
  toFullscreen: () => BoundsBuilder;
  absolute: () => BoundsBuilder;
  relative: () => BoundsBuilder;
  transform: () => BoundsBuilder;
  size: () => BoundsBuilder;
  content: () => BoundsBuilder;
  contentFill: () => BoundsBuilder;
  contentFit: () => BoundsBuilder;
  build: (method?: string) => unknown;
};

type BoundsAccessor = ((id?: string) => BoundsBuilder) & {
  get: (id?: string, phase?: string) => { bounds: unknown; styles: unknown };
};

type ProductTransitionOptions = {
  bounds: BoundsAccessor | { get: (id?: string, phase?: string) => { bounds: unknown; styles: unknown } };
  activeBoundId: string | null;
  progress: number;
};

export const PRODUCT_TRANSITION = {
  OPEN_MS: 1000,
  CLOSE_MS: 700,
  SCALE_FROM: 0.55,
  TRANSLATE_Y: 42,
  OVERLAY_ALPHA: 0.15,
} as const;

function isCallableBounds(b: unknown): b is (id?: string) => BoundsBuilder {
  'worklet';
  return typeof b === 'function';
}

function hasGet(b: unknown): b is { get: (id?: string, phase?: string) => { styles: unknown } } {
  'worklet';
  return !!b && typeof (b as { get: unknown }).get === 'function';
}

function getBoundStyles(b: ProductTransitionOptions['bounds'], id: string) {
  'worklet';
  // Compatibility: support both callable accessor and object with .get()
  if (isCallableBounds(b)) {
    return b(id)
      .relative()
      .transform()
      .content()
      .contentFit()
      .build();
  }
  if (hasGet(b)) {
    const entry = b.get(id);
    return entry?.styles ?? {};
  }
  return {};
}

export function productDetailsTransitionOptions() {
  return {
    headerShown: false,
    enableTransitions: true,
    screenStyleInterpolator: ({bounds, activeBoundId, progress}: ProductTransitionOptions) => {
      'worklet';

      // Ease and compose only non-shared screen content + overlay
      const eased = 1 - (1 - progress) ** 3; // easeOutCubic
      const scale = PRODUCT_TRANSITION.SCALE_FROM + eased * (1 - PRODUCT_TRANSITION.SCALE_FROM);
      const translateY = (1 - eased) * PRODUCT_TRANSITION.TRANSLATE_Y;
      const overlayOpacity = eased * PRODUCT_TRANSITION.OVERLAY_ALPHA;

      if (!activeBoundId) {
        return {
          contentStyle: {
            opacity: eased,
            transform: [{translateY}, {scale}],
          },
          overlayStyle: {
            backgroundColor: 'black',
            opacity: overlayOpacity,
          },
        } as const;
      }

      const animatedBound = getBoundStyles(bounds, activeBoundId);

      return {
        // Shared-element styles keyed by the active bound id
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
