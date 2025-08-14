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
```

## Best Practices

1. **Use worklet functions** for gesture callbacks and animations
2. **Extract magic numbers** to constants
3. **Reuse animation patterns** instead of duplicating code
4. **Keep spring configurations consistent** across similar interactions
5. **Document complex animations** with clear parameter names
