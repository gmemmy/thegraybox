import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {withLayoutContext} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import * as React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import 'react-native-reanimated';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createNativeStackNavigator} from 'react-native-screen-transitions';

import {useColorScheme} from '@/hooks/useColorScheme';
import {productDetailsTransitionOptions} from '@/lib/animation/transitions';

const RootStack = createNativeStackNavigator();
const Stack = withLayoutContext(RootStack.Navigator);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <KeyboardProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{headerShown: false}} />
              <Stack.Screen
                name="demos/nike/product/[id]"
                options={productDetailsTransitionOptions()}
              />
              <Stack.Screen name="demos/chat/[id]" options={{headerShown: false}} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
