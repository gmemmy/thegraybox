import * as React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

import {colors} from '@/theme/colors';
import {radii, shadows, spacing} from '@/theme/tokens';

type ChatNewMessagesPillProps = {
  visible: boolean;
  count: number;
  onPress: () => void;
};

function ChatNewMessagesPill({
  visible,
  count,
  onPress,
}: ChatNewMessagesPillProps) {
  if (!visible) {
    return null;
  }

  const text =
    count === 1 ? 'New message' : `${count > 99 ? '99+' : count} new messages`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={text}
      onPress={onPress}
      style={styles.container}
    >
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

export default React.memo(ChatNewMessagesPill);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44, 
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: radii.full,
    alignSelf: 'center',
    ...shadows.sm,
    elevation: 4,
  },
  text: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
});
