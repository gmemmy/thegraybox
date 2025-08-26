import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {colors} from '@/theme/colors';

type Props = {
  sizes: string[];
  value?: string;
  onChange?: (size: string) => void;
  accentColor?: string;
};

export default function SizeChips({
  sizes,
  value,
  onChange,
  accentColor = colors.backgroundDark,
}: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.chips}>
        {sizes.map((s) => {
          const selected = s === value;
          return (
            <Pressable
              key={s}
              onPress={() => onChange?.(s)}
              style={[
                styles.chip,
                selected ? {backgroundColor: accentColor, borderColor: accentColor} : undefined,
              ]}
            >
              <Text style={[styles.chipText, selected ? {color: colors.background} : undefined]}>
                {s}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {gap: 8},
  chips: {flexDirection: 'row', gap: 12, flexWrap: 'wrap'},
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.nike.lightGray,
  },
  chipText: {fontWeight: '600', color: colors.nike.gray},
});
