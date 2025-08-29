import {Icon, Label, NativeTabs} from 'expo-router/unstable-native-tabs';
import {DynamicColorIOS} from 'react-native';

export default function TabLayout() {
  const dynamic = DynamicColorIOS({ dark: 'white', light: 'black' });
  return (
    <NativeTabs
      blurEffect="prominent"
      backgroundColor="transparent"
      iconColor={dynamic}
      tintColor={dynamic}
      disableTransparentOnScrollEdge={false}
      minimizeBehavior="automatic"
    >
      <NativeTabs.Trigger name="index">
        <Label>Gallery</Label>
        <Icon sf={{default: 'house', selected: 'house.fill'}} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="info">
        <Label>Info</Label>
        <Icon sf={{default: 'info.circle', selected: 'info.circle.fill'}} />
      </NativeTabs.Trigger>
      
    </NativeTabs>
  );
}
