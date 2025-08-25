import {BlurView} from 'expo-blur';
import {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated';

import {ColorDots} from './components/color-dots';
import {PriceCTA} from './components/price-cta';
import {SizeChips} from './components/size-chips';

import type {OptionsSheetController} from '@/hooks/useOptionsSheet';

type Props = {
  controller: OptionsSheetController;
  children?: React.ReactNode;
};

export function OptionsSheet({controller}: Props): React.JSX.Element {
  const AnimatedView = Animated.createAnimatedComponent(View);
  const animatedStyle = useAnimatedStyle(() => {
    const radius = interpolate(controller.progress.value, [0, 1], [0, 20]);
    return {
      top: controller.y.value,
      height: controller.openHeight.value,
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
    } as const;
  });

  const [blockTouches, setBlockTouches] = useState(false);
  useAnimatedReaction(
    () => controller.progress.value > 0.02,
    (current, previous) => {
      if (current !== previous) runOnJS(setBlockTouches)(current);
    },
  );

  return (
    <>
      <Pressable pointerEvents={blockTouches ? 'auto' : 'none'} style={StyleSheet.absoluteFill}>
        <AnimatedView
          pointerEvents="none"
          style={[StyleSheet.absoluteFillObject, {opacity: controller.progress}]}
        >
          <View style={StyleSheet.absoluteFill}>
            <BlurView intensity={40} tint="dark" />
          </View>
          <View style={[StyleSheet.absoluteFill, {backgroundColor: 'rgba(0,0,0,0.18)'}]} />
        </AnimatedView>
      </Pressable>

      <GestureDetector gesture={controller.gesture}>
        <AnimatedView style={[styles.container, animatedStyle]}>
          <View style={styles.handleBar} />
          <View style={[styles.content]}>
            <SizeChips />
            <ColorDots />
            <PriceCTA />
          </View>
        </AnimatedView>
      </GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 1000,
  },
  handleBar: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
  content: {
    gap: 16,
  },
});

export default OptionsSheet;
