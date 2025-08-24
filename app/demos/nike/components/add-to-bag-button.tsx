import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, type ViewStyle} from 'react-native';

import {colors} from '@/theme/colors';

type Props = {
  onPress?: () => void;
  style?: ViewStyle;
};

export function AddToBagButton({onPress, style}: Props) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={[styles.button, style]} onPress={onPress}>
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

export default AddToBagButton;
