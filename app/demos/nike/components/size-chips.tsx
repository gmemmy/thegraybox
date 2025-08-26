import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

type Props = {
  sizes: string[];
  value?: string;
  onChange?: (size: string) => void;
};

export default function SizeChips({sizes, value, onChange}: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.chips}>
        {sizes.map((s) => {
          const selected = s === value;
          return (
            <Pressable
              key={s}
              onPress={() => onChange?.(s)}
              style={[styles.chip, selected ? styles.chipSelected : undefined]}
            >
              <Text style={[styles.chipText, selected ? styles.chipTextSelected : undefined]}>
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
  chip: {paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#f1f1f1'},
  chipSelected: {backgroundColor: '#e1e1e1'},
  chipText: {fontWeight: '600'},
  chipTextSelected: {opacity: 1},
});
