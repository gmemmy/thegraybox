import {Feather} from '@expo/vector-icons';
import {BlurView} from 'expo-blur';
import {useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {runOnJS} from 'react-native-worklets';

import {useAddToBagOverlay} from '@/hooks/useAddToBagOverlay';
import {getOverrideAccent} from '@/lib/color';
import {colors} from '@/theme/colors';

import AddToBagButton from './components/add-to-bag-button';
import SizeChips from './components/size-chips';

import type {OptionsSheetController} from '@/hooks/useOptionsSheet';
import type {Product} from '@/types/product';

type Props = {
  controller: OptionsSheetController;
  product: Product;
  children?: React.ReactNode;
};

export default function OptionsSheet({controller, product}: Props) {
  const AnimatedView = Animated.createAnimatedComponent(View);
  const insets = useSafeAreaInsets();
  const animatedStyle = useAnimatedStyle(() => {
    const radius = interpolate(controller.progress.value, [0, 1], [0, 20]);
    return {
      top: controller.y.value,
      height: controller.openHeight.value,
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
    } as const;
  });

  const [blockTouches, setBlockTouches] = useState(false);
  const overlay = useAddToBagOverlay(
    getOverrideAccent(String(product.image)) || getOverrideAccent(product.id),
  );
  const overlayAnimatedStyle = useAnimatedStyle(
    () => ({opacity: overlay.forceBlur.value ? 1 : controller.progress.value}) as const,
  );
  useAnimatedReaction(
    () => controller.progress.value > 0.02 || overlay.forceBlur.value,
    (current, previous) => {
      if (current !== previous) runOnJS(setBlockTouches)(current);
    },
  );

  const sizes = useMemo(() => ['EU 40', 'EU41', 'EU42', 'EU43', 'EU44', 'EU45', 'EU46'], []);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [hideHeaderImage, setHideHeaderImage] = useState(false);

  function onAddToBag() {
    if (!selectedSize) return;
    setHideHeaderImage(true);
    overlay.runSequence({
      bottomInset: insets.bottom,
      onDone: () => {
        runOnJS(setHideHeaderImage)(false);
      },
    });
    controller.dismiss();
  }

  return (
    <>
      <Pressable pointerEvents={blockTouches ? 'auto' : 'none'} style={StyleSheet.absoluteFill}>
        <AnimatedView
          pointerEvents="none"
          style={[StyleSheet.absoluteFillObject, overlayAnimatedStyle]}
        >
          <View style={StyleSheet.absoluteFill}>
            {/* @ts-expect-error - BlurView is not typed */}
            <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
          </View>
        </AnimatedView>
      </Pressable>

      <GestureDetector gesture={controller.gesture}>
        <AnimatedView
          style={[styles.container, animatedStyle]}
          onLayout={(e) => controller.onMeasureContent(e.nativeEvent.layout.height)}
        >
          <View style={styles.handleBar} />
          <View style={[styles.headerRow]}>
            <AnimatedView ref={overlay.headerImageRef} style={styles.headerImageWrap}>
              <Image
                source={product.image}
                style={[styles.headerImage, hideHeaderImage ? {opacity: 0} : null]}
                resizeMode="contain"
              />
            </AnimatedView>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>{product.title}</Text>
              {product.subtitle ? (
                <Text style={styles.headerSubtitle}>{product.subtitle}</Text>
              ) : null}
            </View>
            <Text style={styles.headerPrice}>{`$${product.price.toFixed(2)}`}</Text>
          </View>

          <View style={[styles.content]}>
            <Text style={styles.sectionLabel}>SELECT SIZE</Text>
            <SizeChips
              sizes={sizes}
              value={selectedSize}
              onChange={setSelectedSize}
              accentColor={
                getOverrideAccent(String(product.image)) || getOverrideAccent(product.id)
              }
            />
            <AddToBagButton
              onPress={onAddToBag}
              color={getOverrideAccent(String(product.image)) || getOverrideAccent(product.id)}
              disabled={!selectedSize}
            />
          </View>
        </AnimatedView>
      </GestureDetector>
      <AnimatedView
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, {zIndex: 1200}, overlay.overlayElementsStyle]}
      >
        <AnimatedView
          style={[
            {
              position: 'absolute',
              width: overlay.config.bottomTargetDiameter,
              height: overlay.config.bottomTargetDiameter,
              borderRadius: overlay.config.bottomTargetDiameter / 2,
              left: overlay.config.targetCenterX - overlay.config.bottomTargetDiameter / 2,
            },
            overlay.bottomTarget.opacityStyle,
            overlay.bottomTarget.translateStyle,
            overlay.bottomTarget.positionStyle,
            overlay.bottomTarget.colorStyle,
          ]}
        >
          <AnimatedView style={[styles.bottomTarget, overlay.bottomTarget.outlineIconOpacity]}>
            <Feather name="shopping-bag" size={22} color="#fff" />
          </AnimatedView>
          <AnimatedView style={[styles.bottomTarget, overlay.bottomTarget.filledIconOpacity]}>
            <Feather name="shopping-bag" size={22} color="#fff" />
          </AnimatedView>
        </AnimatedView>
        <AnimatedView
          style={[
            {
              position: 'absolute',
              width: overlay.config.finalCircleDiameter,
              height: overlay.config.finalCircleDiameter,
              borderRadius: overlay.config.finalCircleDiameter / 2,
              backgroundColor: '#fff',
              left: overlay.config.targetCenterX - overlay.config.finalCircleDiameter / 2,
              top: overlay.config.targetCenterY - overlay.config.finalCircleDiameter / 2,
            },
            overlay.circleAnimatedStyle,
            overlay.circlePositionStyle,
            overlay.circlePhase2FadeStyle,
          ]}
        />
        <Animated.Image
          source={product.image}
          resizeMode="contain"
          style={overlay.imageAnimatedStyle}
        />
      </AnimatedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 1000,
  },
  handleBar: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
  content: {
    gap: 16,
    marginTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.nike.lightGray,
  },
  headerImage: {width: 100, height: 100},
  headerImageWrap: {width: 100, height: 100},
  headerInfo: {flex: 1, paddingHorizontal: 8},
  headerTitle: {fontWeight: '700', fontSize: 16},
  headerSubtitle: {color: '#999', marginTop: 2},
  headerPrice: {fontWeight: '800', fontSize: 18},
  sectionLabel: {alignSelf: 'center', color: '#A1A1A1', fontWeight: '600', marginTop: 8},
  bottomTarget: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
