import {Link, router} from 'expo-router';
import * as React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {GestureDetector} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import {HEAD_RADIUS, TAIL_RADIUS, useGalleryCardInteraction} from '@/hooks/useGalleryCardInteraction';
import {colors} from '@/theme/colors';
import {radii, shadows, spacing} from '@/theme/tokens';

import type {GalleryItem} from '@/lib/registry/gallery';

type Props = {item: GalleryItem};

function GalleryCard({item}: Props) {
  const {gesture, onLayout, styles: hookStyles} = useGalleryCardInteraction();

  const handleLayout = React.useCallback((e: {nativeEvent: {layout: {width: number; height: number}}}) => {
    onLayout(e.nativeEvent.layout.width, e.nativeEvent.layout.height);
  }, [onLayout]);

  return (
    <Link href={item.route} asChild>
      <GestureDetector gesture={gesture}>
        <Pressable accessibilityRole="button" accessibilityLabel={item.title} onPress={() => {
          router.push(item.route)
        }}>
          <Animated.View onLayout={handleLayout} style={[styles.card, hookStyles.cardStyle]}>
            <Image source={item.image} style={styles.image} resizeMode="cover" />
            <View style={styles.scrim} />
            <Animated.View style={[styles.glowTail, hookStyles.tailGlowStyle]} pointerEvents="none" />
            <Animated.View style={[styles.glowHead, hookStyles.headGlowStyle]} pointerEvents="none" />
            <View style={styles.metaOverlay}>
              <Text style={styles.title}>{item.title}</Text>
              {item.subtitle ? <Text style={styles.subtitle}>{item.subtitle}</Text> : null}
            </View>
          </Animated.View>
        </Pressable>
      </GestureDetector>
    </Link>
  );
}

export default React.memo(GalleryCard);

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: radii.lg,
    backgroundColor: colors.background,
    ...shadows.sm,
    shadowOffset: {width: 0, height: 8},
    shadowRadius: 12,
    elevation: 6,
    width: '100%',
    aspectRatio: 16 / 11,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  glowHead: {
    position: 'absolute',
    width: HEAD_RADIUS * 2,
    height: HEAD_RADIUS * 2,
    borderRadius: HEAD_RADIUS,
    backgroundColor: 'rgba(255,255,255,0.60)',
  },
  glowTail: {
    position: 'absolute',
    width: TAIL_RADIUS * 2,
    height: TAIL_RADIUS * 2,
    borderRadius: TAIL_RADIUS,
    backgroundColor: 'rgba(255,255,255,0.48)',
  },
  metaOverlay: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
  },
  title: {fontWeight: '800', fontSize: 16, color: '#fff'},
  subtitle: {color: 'rgba(255,255,255,0.85)', marginTop: 2},
});
