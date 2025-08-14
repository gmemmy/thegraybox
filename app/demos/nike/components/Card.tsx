import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Pressable} from 'react-native';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import type {OptionsSheetController} from '@/hooks/useOptionsSheet';
import type {ImageSourcePropType} from 'react-native';
import {colors} from '@/theme/colors';
import {
  BOTTOM_SHEET_SPRINGS,
  ANIMATION_TIMING,
  shouldOpenSheet,
} from '@/lib/animation/bottom-sheet';
import {createBounceAnimation, createScaleAnimation} from '@/lib/animation/patterns';

type Props = {
  title?: string;
  image?: ImageSourcePropType;
  onPress?: () => void;
  onCheckoutPress?: () => void;
  controller?: OptionsSheetController;
};

export function Card({
  title = 'Air Max Exosense',
  image,
  onPress,
  onCheckoutPress,
  controller,
}: Props) {
  const bounceOffset = useSharedValue(0);
  const baseScale = useSharedValue(0.9);
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

  return (
    <GestureDetector gesture={pan}>
      <Pressable style={styles.card} onPress={onPress}>
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
          <Animated.Image
            source={image ?? require('../../../../assets/images/nike/hero-01.png')}
            resizeMode="contain"
            style={[styles.image, imageMorphStyle]}
          />
          <Animated.View
            entering={FadeIn.duration(350).delay(240)}
            style={[styles.priceContainer, fadeStyle]}
          >
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.price}>$160.00</Text>
          </Animated.View>
          <TouchableOpacity style={styles.checkoutButton} onPress={onCheckoutPress}>
            <Text style={styles.checkoutButtonText}>Add to bag</Text>
          </TouchableOpacity>
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
  checkoutButton: {
    backgroundColor: colors.nike.purple,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Card;
