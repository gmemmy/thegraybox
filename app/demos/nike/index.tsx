import type React from 'react';
import {Stack} from 'expo-router';
import ShoeDetail from './ShoeDetail';

export default function NikeDemoScreen(): React.JSX.Element {
  return (
    <>
      <Stack.Screen options={{headerShown: false}} />
      <ShoeDetail />
    </>
  );
}
