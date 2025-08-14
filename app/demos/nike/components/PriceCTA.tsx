import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

export function PriceCTA() {
  return (
    <View style={styles.row}>
      <Text style={styles.price}>$149</Text>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Add to bag</Text>
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

export default PriceCTA;
