import {Feather} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import * as React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue} from 'react-native-reanimated';

import {createSwingAnimation} from '@/lib/animation/patterns';
import {colors} from '@/theme/colors';

type Props = {
  onCartPress?: () => void;
};

const ANIMATION_CONFIG = {
  SWING_ANGLE: 8,
  SWING_DURATION: 120,
  SWING_CYCLES: 3,
} as const;

export default function NikeHeader({onCartPress}: Props) {
  const router = useRouter();
  const shakeOffset = useSharedValue(0);
  const AnimatedView = Animated.createAnimatedComponent(View);

  React.useEffect(() => {
    const {SWING_ANGLE, SWING_DURATION, SWING_CYCLES} = ANIMATION_CONFIG;
    createSwingAnimation(shakeOffset, {
      angle: SWING_ANGLE,
      duration: SWING_DURATION,
      cycles: SWING_CYCLES,
    });
  }, [shakeOffset]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{rotateZ: `${shakeOffset.value}deg`}],
  }));

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.leftBtn}>
        <View style={styles.square} />
      </Pressable>
      <View style={styles.titleWrap}>
        <Text style={styles.title}>Nike</Text>
      </View>
      <Pressable onPress={onCartPress} style={styles.rightBtn}>
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>1</Text>
        </View>
        <AnimatedView style={shakeStyle}>
          <Feather name="shopping-bag" size={24} color={colors.backgroundDark} />
        </AnimatedView>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.nike.lightGray,
    shadowColor: colors.backgroundDark,
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 0.9,
    shadowRadius: -10,
    elevation: 2,
  },
  leftBtn: {padding: 8},
  rightBtn: {padding: 8},
  square: {width: 24, height: 24, borderRadius: 6, backgroundColor: colors.nike.black},
  titleWrap: {flexDirection: 'row', alignItems: 'center', gap: 8},
  title: {fontSize: 22, fontWeight: '800'},
  cartBadge: {
    position: 'absolute',
    right: 2,
    top: 2,
    backgroundColor: colors.nike.red,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  cartBadgeText: {color: '#fff', fontSize: 10, fontWeight: '700'},
});
