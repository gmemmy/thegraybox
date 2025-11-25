import {MaterialIcons} from '@expo/vector-icons';
import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {spacing} from '@/theme/tokens';

import LiquidGlassContainer from './liquid-glass-container';

type ChatHeaderNameProps = {
  name: string;
  containerStyle: React.ComponentProps<typeof LiquidGlassContainer>['style'];
  fallbackStyle?: React.ComponentProps<typeof LiquidGlassContainer>['fallbackStyle'];
};

function ChatHeaderName({
  name,
  containerStyle,
  fallbackStyle,
}: ChatHeaderNameProps) {
  return (
    <LiquidGlassContainer style={containerStyle} fallbackStyle={fallbackStyle}>
      <View style={styles.nameContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <MaterialIcons name="chevron-right" size={20} color="#ffffff" />
      </View>
    </LiquidGlassContainer>
  );
}

export default React.memo(ChatHeaderName);

const styles = StyleSheet.create({
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
  },
});
