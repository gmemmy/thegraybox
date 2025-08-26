import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

type Props = {price: number; label?: string; onPress?: () => void};

export default function PriceCTA({price, label = 'Add to bag', onPress}: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.price}>{`$${price.toFixed(2)}`}</Text>
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  price: {fontWeight: '700', fontSize: 18},
  button: {backgroundColor: '#111', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10},
  buttonText: {color: '#fff', fontWeight: '600'},
});
