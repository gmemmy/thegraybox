import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {OptionsSheet} from './OptionsSheet';
import {useOptionsSheet} from '../../../hooks/useOptionsSheet';
import {Card} from './components/Card';
import {NikeHeader} from './components/NikeHeader';

export default function ShoeDetail() {
  const controller = useOptionsSheet();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <NikeHeader onCartPress={() => {}} />
      </View>
      <FlatList
        data={[{key: 'card-1'}, {key: 'card-2'}]}
        contentContainerStyle={{padding: 16}}
        renderItem={({index}) => (
          <View style={{marginBottom: 16}}>
            <Card
              title={index === 0 ? 'Air Max Exosense' : 'Air Max Pulse'}
              onPress={() => controller.present()}
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
  container: {flex: 1, backgroundColor: '#f8f8f8'},
  header: {paddingBottom: 25},
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
