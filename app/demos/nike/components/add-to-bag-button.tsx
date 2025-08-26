import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, type ViewStyle} from 'react-native';

import {colors} from '@/theme/colors';

type Props = {
  onPress?: () => void;
  style?: ViewStyle;
  color?: string;
  disabled?: boolean;
};

export default function AddToBagButton({
  onPress,
  style,
  color = colors.nike.black,
  disabled = false,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      disabled={disabled}
      style={[
        styles.button,
        {backgroundColor: disabled ? '#cfcfcf' : color, opacity: disabled ? 0.7 : 1},
        style,
      ]}
      onPress={onPress}
    >
      <Text style={styles.text}>Add to bag</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.nike.black,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
