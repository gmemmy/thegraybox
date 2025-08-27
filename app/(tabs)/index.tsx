import * as React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import GalleryCard from '@/components/gallery/gallery-card';
import {GALLERY_ITEMS} from '@/lib/registry/gallery';

export default function GalleryScreen() {
  const insets = useSafeAreaInsets();
  return (
    <FlatList
      contentContainerStyle={[styles.container, {paddingTop: insets.top + 8}]}
      data={GALLERY_ITEMS}
      numColumns={2}
      columnWrapperStyle={styles.row}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => (
        <View style={styles.cell}>
          <GalleryCard item={item} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {padding: 16, paddingBottom: 24},
  row: {gap: 16},
  cell: {flex: 1, marginBottom: 16},
});
