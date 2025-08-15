import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const COLORS = ['#111', '#f33', '#36f'] as const;

export function ColorDots() {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>Colors</Text>
      <View style={styles.dots}>
        {COLORS.map((c) => (
          <View key={c} style={[styles.dot, {backgroundColor: c}]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {gap: 8},
  title: {fontWeight: '600'},
  dots: {flexDirection: 'row', gap: 12},
  dot: {width: 20, height: 20, borderRadius: 10},
});

export default ColorDots;
