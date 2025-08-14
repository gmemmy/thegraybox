import React from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  position?: 'top' | 'bottom';
};

export default function SafeAreaSpacer({position = 'bottom'}: Props) {
  const insets = useSafeAreaInsets();
  const height = position === 'bottom' ? insets.bottom : insets.top;
  if (!height) return null;
  return <View style={{height}} />;
}
