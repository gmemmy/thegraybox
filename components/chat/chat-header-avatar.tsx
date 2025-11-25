import * as React from 'react';
import {
  Image,
  type ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {colors} from '@/theme/colors';

import LiquidGlassContainer from './liquid-glass-container';

type ChatHeaderAvatarProps = {
  avatar?: ImageSourcePropType;
  fallbackInitial: string;
  containerStyle: React.ComponentProps<typeof LiquidGlassContainer>['style'];
  fallbackStyle?: React.ComponentProps<typeof LiquidGlassContainer>['fallbackStyle'];
};

function ChatHeaderAvatar({
  avatar,
  fallbackInitial,
  containerStyle,
  fallbackStyle,
}: ChatHeaderAvatarProps) {
  return (
    <LiquidGlassContainer style={containerStyle} fallbackStyle={fallbackStyle}>
      {avatar ? (
        <Image source={avatar} style={styles.avatar} resizeMode="cover" />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarInitial}>
            {fallbackInitial.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
    </LiquidGlassContainer>
  );
}

export default React.memo(ChatHeaderAvatar);

const styles = StyleSheet.create({
  avatar: {
    width: 72,
    height: 75,
    borderRadius: 36,
  },
  avatarPlaceholder: {
    width: 72,
    height: 75,
    borderRadius: 36,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
});
