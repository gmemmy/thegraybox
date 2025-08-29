import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function InfoTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Info</Text>
      <Text style={styles.text}>This is the Info tab.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  title: {fontSize: 24, fontWeight: '700', marginBottom: 8},
  text: {fontSize: 14, opacity: 0.7},
});
