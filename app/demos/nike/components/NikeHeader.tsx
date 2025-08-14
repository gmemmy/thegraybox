import React from 'react';
import {View, Text, StyleSheet, Pressable, Image} from 'react-native';
import {useRouter} from 'expo-router';

type Props = {
  onCartPress?: () => void;
};

export function NikeHeader({onCartPress}: Props) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.leftBtn}>
        <View style={styles.square} />
      </Pressable>
      <View style={styles.titleWrap}>
        <Image source={require('../../../../assets/images/nike/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Nike</Text>
      </View>
      <Pressable onPress={onCartPress} style={styles.rightBtn}>
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>1</Text>
        </View>
        <View style={[styles.square, styles.purple]} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftBtn: {padding: 8},
  rightBtn: {padding: 8},
  square: {width: 24, height: 24, borderRadius: 6, backgroundColor: '#111'},
  purple: {backgroundColor: '#7c3aed'},
  titleWrap: {flexDirection: 'row', alignItems: 'center', gap: 8},
  logo: {width: 20, height: 20, resizeMode: 'contain'},
  title: {fontSize: 22, fontWeight: '800'},
  cartBadge: {
    position: 'absolute',
    right: 2,
    top: 2,
    backgroundColor: '#ef4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  cartBadgeText: {color: '#fff', fontSize: 10, fontWeight: '700'},
});

export default NikeHeader;
