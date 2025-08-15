import {Stack} from 'expo-router';

import ShoeDetail from './shoe-detail';

import type React from 'react';

export default function NikeDemoScreen(): React.JSX.Element {
  return (
    <>
      <Stack.Screen options={{headerShown: false}} />
      <ShoeDetail />
    </>
  );
}
