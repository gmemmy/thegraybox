import {
  isLiquidGlassSupported,
  LiquidGlassView,
} from '@callstack/liquid-glass';
import * as React from 'react';
import {View, type ViewStyle} from 'react-native';

type LiquidGlassContainerProps = {
  children: React.ReactNode;
  style: ViewStyle;
  fallbackStyle?: ViewStyle;
};

function LiquidGlassContainer({
  children,
  style,
  fallbackStyle,
}: LiquidGlassContainerProps) {
  if (isLiquidGlassSupported) {
    return (
      <LiquidGlassView style={style} effect="regular" interactive colorScheme="light">
        {children}
      </LiquidGlassView>
    );
  }
  return <View style={[style, fallbackStyle]}>{children}</View>;
}

export default React.memo(LiquidGlassContainer);
