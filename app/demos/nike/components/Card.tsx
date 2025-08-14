import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Animated, {
  FadeIn,
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import type {OptionsSheetController} from '@/hooks/useOptionsSheet';
import type {ImageSourcePropType} from 'react-native';

type Props = {
  title?: string;
  image?: ImageSourcePropType;
  onPress?: () => void;
  controller?: OptionsSheetController;
};

export function Card({title = 'Air Max Exosense', image, onPress, controller}: Props) {
  const bounceOffset = useSharedValue(0);
  const baseScale = useSharedValue(0.4);
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
      const threshold = 0.15 * controller.screenHeight;
      const shouldOpen = dragged > threshold || e.velocityY > 800;
      controller.y.value = shouldOpen ? openY : closedY;
    });

  React.useEffect(() => {
    const scaleDuration = 350;
    const startDelay = 250;
    baseScale.value = withDelay(
      startDelay,
      withTiming(1, {duration: scaleDuration, easing: Easing.out(Easing.cubic)}),
    );
    const bounceStart = startDelay + scaleDuration;
    bounceOffset.value = withDelay(
      bounceStart,
      withRepeat(
        withSequence(
          withTiming(-8, {duration: 450, easing: Easing.out(Easing.quad)}),
          withTiming(0, {duration: 450, easing: Easing.in(Easing.quad)}),
        ),
        3,
        false,
      ),
    );
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
      <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={onPress}>
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
        </View>
      </TouchableOpacity>
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
  title: {marginTop: 8, fontWeight: '400', color: 'gray', fontSize: 15},
  highlight: {
    position: 'absolute',
    left: -2.5,
    top: 25,
    height: 40,
    width: 5,
    borderRadius: 2,
    backgroundColor: '#7c3aed',
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
    color: '#7c3aed',
    marginBottom: 4,
  },
  priceContainer: {
    marginTop: 10,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: 'gray',
  },
  price: {
    fontSize: 19,
    color: 'red',
    fontWeight: '500',
    marginTop: 6,
  },
});

export default Card;
