import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export function SizeChips() {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>Sizes</Text>
      <View style={styles.chips}>
        {['7', '8', '9', '10'].map((s) => (
          <View key={s} style={styles.chip}>
            <Text>{s}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {gap: 8},
  title: {fontWeight: '600'},
  chips: {flexDirection: 'row', gap: 8},
  chip: {paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#f1f1f1'},
});

export default SizeChips;
