# Animation Library

This directory contains reusable animation utilities and patterns for the Gray Box app.

## Structure

### `springs.ts`

Predefined spring configurations for smooth animations:

- `iosLike()` - iOS-style spring with slight overshoot
- `gentle()` - Gentle spring with overshoot clamping

### `bottom-sheet.ts`

Bottom sheet specific constants and utilities:

- Height ratios and thresholds
- Gesture detection logic
- Spring configurations
- Utility functions for worklet contexts

### `transitions.ts`

Screen transition configuration helpers:

- `PRODUCT_TRANSITION` – central constants for durations and emphasis
- `productDetailsTransitionOptions()` – returns options for the product details screen
  - Delegates shared-element math to the library via `bounds().relative().transform().content().contentFit().build()`
  - Adds screen `contentStyle` emphasis (opacity, scale, translateY)
  - Applies `overlayStyle` to dim the previous screen during the transition

### `patterns.ts`

Common animation patterns:

- `createBounceAnimation()` - Bouncing effect with configurable parameters
- `createScaleAnimation()` - Scale transitions
- `createSwingAnimation()` - Swing/rotation effects

### `geometry.ts`

Geometric utilities:

- `clamp()` - Clamp values between min/max
- `lerp()` - Linear interpolation
- `Point` type definition

### `scroll.ts`

Scroll-related utilities:

- `rubberband()` - Rubber band effect for overscroll

## Usage

```typescript
import {iosLike, gentle} from '@/lib/animation/springs';
import {createBounceAnimation} from '@/lib/animation/patterns';
import {shouldOpenSheet} from '@/lib/animation/bottom-sheet';
import {productDetailsTransitionOptions} from '@/lib/animation/transitions';

// Use predefined springs
const springConfig = iosLike();

// Create bounce animation
createBounceAnimation(sharedValue, {
  delay: 100,
  duration: 450,
  offset: 8,
  cycles: 3,
});

// Check gesture thresholds
const shouldOpen = shouldOpenSheet(dragged, velocity, screenHeight);

// Navigator options for product details
<Stack.Screen name="product/[id]" options={productDetailsTransitionOptions()} />
```
