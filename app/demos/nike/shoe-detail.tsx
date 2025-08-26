import {useRouter} from 'expo-router';
import React from 'react';
import {FlatList, Image, StyleSheet, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

import {getOverrideAccent} from '@/lib/color';
import {colors} from '@/theme/colors';

import Card from './components/card';
import NikeHeader from './components/nike-header';
import OptionsSheet from './options-sheet';
import {useOptionsSheet} from '../../../hooks/useOptionsSheet';

import type {Product} from '@/types/product';

const PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Air Max Exosense',
    subtitle: "'Atomic Powder'",
    price: 270,
    image: require('../../../assets/images/nike/nike-01.png'),
  },
  {
    id: '2',
    title: 'Air Max Pulse',
    subtitle: 'Kinetic',
    price: 149,
    image: require('../../../assets/images/nike/nike-02.png'),
  },
  {
    id: '3',
    title: 'Air Max Pulse',
    subtitle: 'Ultra',
    price: 199,
    image: require('../../../assets/images/nike/nike-03.png'),
  },
  {
    id: '4',
    title: 'Air Max 97',
    subtitle: 'Black/Silver',
    price: 189,
    image: require('../../../assets/images/nike/nike-04.png'),
  },
  {
    id: '5',
    title: 'Air Max Hero',
    subtitle: 'Volt',
    price: 210,
    image: require('../../../assets/images/nike/nike-05.png'),
  },
];

function ShoeDetail() {
  const controller = useOptionsSheet();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomPadding = 16 + insets.bottom + 64 + 12;
  const [selected, setSelected] = React.useState<Product>(PRODUCTS[0]);

  return (
    <SafeAreaView mode="padding" edges={['top']} style={{backgroundColor: colors.background}}>
      <NikeHeader onCartPress={() => controller.present()} />
      <View style={styles.container}>
        <FlatList
          data={PRODUCTS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.contentContainer, {paddingBottom: bottomPadding}]}
          renderItem={({item}) => (
            <View style={{marginBottom: 16}}>
              <Card
                id={item.id}
                title={item.title}
                subtitle={item.subtitle}
                price={item.price}
                image={item.image}
                accentColor={getOverrideAccent(String(item.image)) || getOverrideAccent(item.id)}
                onPress={() => {
                  const asset = Image.resolveAssetSource(item.image) ?? {uri: ''};
                  router.push({
                    pathname: '/product/[id]',
                    params: {
                      id: item.id,
                      title: item.title,
                      subtitle: item.subtitle,
                      price: String(item.price),
                      imageUri: asset.uri,
                    },
                  });
                }}
                onCheckoutPress={() => {
                  setSelected(item);
                  controller.present();
                }}
                controller={controller}
              />
            </View>
          )}
        />
      </View>
      <OptionsSheet controller={controller} product={selected} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: colors.background},
  contentContainer: {padding: 16, backgroundColor: colors.background},
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

export default ShoeDetail;
