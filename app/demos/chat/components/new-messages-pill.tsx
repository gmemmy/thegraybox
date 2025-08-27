import * as React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import Animated, {FadeInDown, FadeOutUp} from 'react-native-reanimated';

import {colors} from '@/theme/colors';

type Props = {
  count: number;
  onPress: () => void;
};

export default function NewMessagesPill({count, onPress}: Props) {
  return (
    <Animated.View
      entering={FadeInDown.duration(160)}
      exiting={FadeOutUp.duration(160)}
      style={styles.wrap}
    >
      <Pressable accessibilityRole="button" onPress={onPress} style={styles.pill}>
        <Text style={styles.text}>{count > 99 ? '99+' : `${count}`} new messages</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 56,
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 14,
  },
  text: {color: colors.background, fontWeight: '700'},
});
