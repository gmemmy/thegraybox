import {Entypo} from '@expo/vector-icons';
import {useLocalSearchParams, useRouter} from 'expo-router';
import React from 'react';
import {Pressable, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Transition from 'react-native-screen-transitions';

import AddToBagButton from '@/app/demos/nike/components/add-to-bag-button';
import {OptionsSheet} from '@/app/demos/nike/options-sheet';
import {useOptionsSheet} from '@/hooks/useOptionsSheet';
import {colors} from '@/theme/colors';

export function useScreenWidth() {
  const {width} = useWindowDimensions();
  return width;
}

export default function ProductDetails() {
  const {id} = useLocalSearchParams<{id: string}>();
  const screenWidth = useScreenWidth();
  const router = useRouter();
  const {top} = useSafeAreaInsets();
  const controller = useOptionsSheet();

  const product = {
    id: id || '1',
    name: 'Air Max Exosense',
    brand: 'Nike',
    price: '$160.00',
    description:
      'Experience ultimate comfort and style with the Nike Air Max Exosense. This innovative sneaker combines cutting-edge technology with timeless design.',
    features: [
      'Air Max cushioning for superior comfort',
      'Breathable mesh upper',
      'Durable rubber outsole',
      'Lightweight construction',
    ],
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Black', 'White', 'Red'],
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Pressable onPress={() => router.back()} style={[styles.backBtn, {top: top + 8}]}>
        <Entypo name="chevron-small-left" size={24} color="black" />
      </Pressable>
      <Transition.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingTop: top + 8, paddingBottom: 12}}
      >
        <View style={[styles.heroContainer, {width: screenWidth, height: screenWidth * 0.74}]}>
          <Transition.View sharedBoundTag={`shoe-${product.id}`} style={styles.heroImage}>
            <Animated.Image
              source={require('../../assets/images/nike/hero-01.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </Transition.View>
        </View>
        <View style={styles.ctaWrap}>
          <Animated.View entering={FadeInDown.delay(620).duration(260)}>
            <AddToBagButton onPress={() => controller.present()} />
          </Animated.View>
        </View>
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(720).duration(260)} style={styles.header}>
            <Text style={styles.brand}>{product.brand}</Text>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>{product.price}</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(820).duration(240)} style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(900).duration(240)} style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            {product.features.map((feature) => (
              <View key={feature} style={styles.featureItem}>
                <View style={styles.bullet} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(980).duration(240)} style={styles.section}>
            <Text style={styles.sectionTitle}>Available Sizes</Text>
            <View style={styles.sizeContainer}>
              {product.sizes.map((size) => (
                <View key={size} style={styles.sizeChip}>
                  <Text style={styles.sizeText}>{size}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(1060).duration(240)} style={styles.section}>
            <Text style={styles.sectionTitle}>Colors</Text>
            <View style={styles.colorContainer}>
              {product.colors.map((color) => (
                <View key={color} style={styles.colorChip}>
                  <Text style={styles.colorText}>{color}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </View>
      </Transition.ScrollView>
      <OptionsSheet controller={controller} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    elevation: 3,
  },
  backIcon: {fontSize: 22, fontWeight: '600', color: '#111'},
  ctaWrap: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  header: {
    marginBottom: 24,
  },
  brand: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.nike.gray,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.nike.black,
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.nike.purple,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.nike.black,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.nike.gray,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.nike.purple,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.nike.gray,
    flex: 1,
  },
  sizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sizeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.nike.black,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.nike.purple,
    borderRadius: 20,
  },
  colorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
