import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRouter} from 'expo-router';
import {OptionsSheet} from './OptionsSheet';
import {useOptionsSheet} from '../../../hooks/useOptionsSheet';
import {Card} from './components/Card';
import {NikeHeader} from './components/NikeHeader';
import {colors} from '@/theme/colors';

export default function ShoeDetail() {
  const controller = useOptionsSheet();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <NikeHeader onCartPress={() => controller.present()} />
      <FlatList
        data={[{key: 'card-1'}, {key: 'card-2'}]}
        contentContainerStyle={styles.contentContainer}
        renderItem={({index}) => (
          <View style={{marginBottom: 16}}>
            <Card
              id={index === 0 ? '1' : '2'}
              title={index === 0 ? 'Air Max Exosense' : 'Air Max Pulse'}
              onPress={() => router.push(`/product/${index === 0 ? '1' : '2'}`)}
              onCheckoutPress={() => controller.present()}
              controller={controller}
            />
          </View>
        )}
      />
      <OptionsSheet controller={controller} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.nike.lightGray},
  contentContainer: {padding: 16},
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    minHeight: 96,
  },
  stickyButton: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: '#111',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  stickyButtonText: {color: '#fff', fontWeight: '600', fontSize: 16},
});
