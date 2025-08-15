import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Transition from 'react-native-screen-transitions';

import {
  ANIMATION_TIMING,
  BOTTOM_SHEET_SPRINGS,
  shouldOpenSheet,
} from '@/lib/animation/bottom-sheet';
import {createBounceAnimation, createScaleAnimation} from '@/lib/animation/patterns';
import {PRODUCT_TRANSITION} from '@/lib/animation/transitions';
import {selection} from '@/lib/haptics';
import {colors} from '@/theme/colors';

import AddToBagButton from './add-to-bag-button';

import type {OptionsSheetController} from '@/hooks/useOptionsSheet';
import type {ImageSourcePropType} from 'react-native';

type Props = {
  id?: string;
  title?: string;
  image?: ImageSourcePropType;
  onPress?: () => void;
  onCheckoutPress?: () => void;
  controller?: OptionsSheetController;
};

export function Card({
  id = '1',
  title = 'Air Max Exosense',
  image,
  onPress,
  onCheckoutPress,
  controller,
}: Props) {
  const bounceOffset = useSharedValue(0);
  const baseScale = useSharedValue(0.9);
  const ctaOpacity = useSharedValue(1);
  const pan = Gesture.Pan()
    .activeOffsetY(10)
    .onUpdate((e) => {
      if (!controller) return;
      const openY = controller.screenHeight - controller.openHeight.value;
      const closedY = controller.screenHeight;
      const next = closedY - e.translationY;
      controller.y.value = Math.max(openY, Math.min(closedY, next));
    })
    .onEnd((e) => {
      if (!controller) return;
      const openY = controller.screenHeight - controller.openHeight.value;
      const closedY = controller.screenHeight;
      const dragged = closedY - controller.y.value; // distance opened
      const shouldOpen = shouldOpenSheet(dragged, e.velocityY, controller.screenHeight);

      if (shouldOpen) {
        runOnJS(selection)();
      }

      controller.y.value = withSpring(
        shouldOpen ? openY : closedY,
        shouldOpen ? BOTTOM_SHEET_SPRINGS.OPEN : BOTTOM_SHEET_SPRINGS.CLOSE,
      );
    });

  React.useEffect(() => {
    const {START_DELAY, SCALE_DURATION} = ANIMATION_TIMING;

    createScaleAnimation(baseScale, {
      delay: START_DELAY,
      duration: SCALE_DURATION,
      from: 0.9,
      to: 1,
      easing: 'out',
    });

    // Create bounce animation after scale completes
    createBounceAnimation(bounceOffset, {
      delay: START_DELAY + SCALE_DURATION,
      duration: ANIMATION_TIMING.BOUNCE_DURATION,
      offset: ANIMATION_TIMING.BOUNCE_OFFSET,
      cycles: ANIMATION_TIMING.BOUNCE_CYCLES,
      easing: 'out',
    });
  }, [baseScale, bounceOffset]);

  const fadeStyle = useAnimatedStyle(() => ({opacity: 1 - (controller?.progress.value ?? 0)}));
  const imageMorphStyle = useAnimatedStyle(() => ({
    transform: [
      {translateY: bounceOffset.value * (1 - (controller?.progress.value ?? 0))},
      {scale: baseScale.value * (1 - 0.05 * (controller?.progress.value ?? 0))},
    ],
  }));

  const ctaStyle = useAnimatedStyle(() => ({opacity: ctaOpacity.value}));

  const handlePress = () => {
    ctaOpacity.value = withSequence(
      withTiming(0, {duration: 160}),
      withDelay(PRODUCT_TRANSITION.OPEN_MS, withTiming(1, {duration: 0})),
    );
    onPress?.();
  };

  return (
    <GestureDetector gesture={pan}>
      <Pressable style={styles.card} onPress={handlePress}>
        <View style={styles.highlight} />
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.brand}>Nike</Text>
            <Animated.Text
              entering={FadeIn.duration(350).delay(0)}
              style={[styles.title, fadeStyle]}
            >
              {title}
            </Animated.Text>
          </View>
          <Transition.View sharedBoundTag={`shoe-${id}`}>
            <Animated.Image
              source={image ?? require('../../../../assets/images/nike/hero-01.png')}
              resizeMode="contain"
              style={[styles.image, imageMorphStyle]}
            />
          </Transition.View>
          <Animated.View
            entering={FadeIn.duration(350).delay(240)}
            style={[styles.priceContainer, fadeStyle]}
          >
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.price}>$160.00</Text>
          </Animated.View>
          <Animated.View style={ctaStyle}>
            <AddToBagButton onPress={onCheckoutPress} />
          </Animated.View>
        </View>
      </Pressable>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1f1f1f',
    shadowOffset: {width: 2, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {width: '100%', height: 120},
  title: {marginTop: 8, fontWeight: '400', color: colors.nike.gray, fontSize: 15},
  highlight: {
    position: 'absolute',
    left: -2.5,
    top: 25,
    height: 40,
    width: 5,
    borderRadius: 2,
    backgroundColor: colors.nike.purple,
  },
  content: {
    width: '100%',
  },
  titleContainer: {
    marginBottom: 20,
  },
  brand: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.nike.purple,
    marginBottom: 4,
  },
  priceContainer: {
    marginTop: 10,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.nike.gray,
  },
  price: {
    fontSize: 19,
    color: colors.nike.orange,
    fontWeight: '500',
    marginTop: 6,
  },
});

export default Card;
