import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

import {colors} from '@/theme/colors';

type Props = {
  timestamp: number;
};

function formatDay(ts: number) {
  const d = new Date(ts);
  const today = new Date();
  const isSameDay =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();
  if (isSameDay) return 'Today';
  return d.toLocaleDateString(undefined, {month: 'short', day: 'numeric'});
}

export default function DateSeparator({timestamp}: Props) {
  const label = React.useMemo(() => formatDay(timestamp), [timestamp]);
  return (
    <Animated.View
      entering={FadeIn.duration(120).delay(20)}
      exiting={FadeOut.duration(100)}
      style={styles.container}
    >
      <View style={styles.pill} accessibilityRole="text" accessibilityLabel={label}>
        <Text style={styles.text}>{label}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {alignItems: 'center', paddingVertical: 8},
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.backgroundDark,
    opacity: 0.12,
  },
  text: {
    fontSize: 12,
    color: '#000',
    opacity: 0.8,
  },
});
