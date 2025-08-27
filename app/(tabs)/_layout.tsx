import {BlurView} from 'expo-blur';
import {Tabs} from 'expo-router';
import {StyleSheet} from 'react-native';

function TabBarBlurBackground() {
  // @ts-expect-error - BlurView is not typed
  return <BlurView intensity={50} tint="systemChromeMaterial" style={StyleSheet.absoluteFill} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          left: 12,
          right: 12,
          bottom: 12,
          height: 64,
          borderRadius: 20,
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          elevation: 0,
          overflow: 'hidden',
        },
        tabBarBackground: () => <TabBarBlurBackground />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Gallery',
        }}
      />
    </Tabs>
  );
}
