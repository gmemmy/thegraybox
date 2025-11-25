import {MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import * as React from 'react';
import {Pressable, StyleSheet, type ViewStyle} from 'react-native';

import LiquidGlassContainer from './liquid-glass-container';

type ChatHeaderButtonProps = {
  icon: string;
  iconFamily?: 'material' | 'material-community';
  size?: number;
  onPress: () => void;
  accessibilityLabel: string;
  containerStyle: ViewStyle;
  fallbackStyle?: ViewStyle;
  hitSlop?: {top: number; bottom: number; left: number; right: number};
};

function ChatHeaderButton({
  icon,
  iconFamily = 'material',
  size = 24,
  onPress,
  accessibilityLabel,
  containerStyle,
  fallbackStyle,
  hitSlop = {top: 8, bottom: 8, left: 8, right: 8},
}: ChatHeaderButtonProps) {
  return (
    <LiquidGlassContainer style={containerStyle} fallbackStyle={fallbackStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={styles.buttonInner}
        hitSlop={hitSlop}
      >
        {iconFamily === 'material-community' ? (
          <MaterialCommunityIcons
            name={icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
            size={size}
            color="#ffffff"
          />
        ) : (
          <MaterialIcons
            name={icon as React.ComponentProps<typeof MaterialIcons>['name']}
            size={size}
            color="#ffffff"
          />
        )}
      </Pressable>
    </LiquidGlassContainer>
  );
}

export default React.memo(ChatHeaderButton);

const styles = StyleSheet.create({
  buttonInner: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
