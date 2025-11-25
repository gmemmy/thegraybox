import {useRouter} from 'expo-router';
import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Chat} from '@/lib/chat/domain';
import {getChatAvatarForConv} from '@/lib/registry/chat';
import {formatChatHeaderDate} from '@/lib/time/format';
import {radii, spacing} from '@/theme/tokens';

import ChatHeaderAvatar from './chat-header-avatar';
import ChatHeaderButton from './chat-header-button';
import ChatHeaderName from './chat-header-name';

import type {ChatThreadId} from '@/lib/chat/types';

type ChatHeaderProps = {
  threadId: ChatThreadId;
};

function ChatHeader({threadId}: ChatHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const metadataSelector = React.useMemo(
    () => Chat.selectors.threadMetadata(threadId),
    [threadId],
  );
  const metadata = Chat.useStore(metadataSelector);

  const messagesSelector = React.useMemo(
    () => Chat.selectors.messages(threadId),
    [threadId],
  );
  const messages = Chat.useStore(messagesSelector);

  const participantName = metadata?.participantName ?? 'Unknown';
  const lastActivityAt = metadata?.lastActivityAt ?? Date.now();
  
  // Get user's avatar from the conversation/thread
  const userAvatar = getChatAvatarForConv(threadId);

  // Get the last message timestamp, or use lastActivityAt
  const lastMessageTimestamp = React.useMemo(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      return lastMessage.createdAt;
    }
    return lastActivityAt;
  }, [messages, lastActivityAt]);

  const headerDate = React.useMemo(
    () => formatChatHeaderDate(lastMessageTimestamp),
    [lastMessageTimestamp],
  );

  const headerHeight = 56 + insets.top;

  const handleBackPress = React.useCallback(() => {
    router.back();
  }, [router]);

  const handleVideoCallPress = React.useCallback(() => {
    // TODO: Implement video call
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          height: headerHeight,
          paddingTop: insets.top,
        },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <ChatHeaderButton
            icon="arrow-back"
            size={24}
            onPress={handleBackPress}
            accessibilityLabel="Go back"
            containerStyle={styles.liquidGlassContainer}
            fallbackStyle={styles.fallbackContainer}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
          />
        </View>

        <View style={styles.centerSection}>
          <ChatHeaderAvatar
            avatar={userAvatar}
            fallbackInitial={participantName}
            containerStyle={styles.avatarLiquidGlassContainer}
            fallbackStyle={styles.fallbackContainer}
          />
          <ChatHeaderName
            name={participantName}
            containerStyle={styles.nameLiquidGlassContainer}
            fallbackStyle={styles.fallbackContainer}
          />
          <Text style={styles.date}>{headerDate}</Text>
        </View>

        <View style={styles.rightSection}>
          <ChatHeaderButton
            icon="video-outline"
            iconFamily="material-community"
            size={35}
            onPress={handleVideoCallPress}
            accessibilityLabel="Video call"
            containerStyle={styles.liquidGlassContainer}
            fallbackStyle={styles.fallbackContainer}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          />
        </View>
      </View>
    </View>
  );
}

export default React.memo(ChatHeader);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.md,
    flexShrink: 0,
    gap: spacing.sm,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 0,
    paddingTop: -5,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.md,
    flexShrink: 0,
  },
  liquidGlassContainer: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: spacing.xs,
  },
  fallbackContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  avatarLiquidGlassContainer: {
    width: 72,
    height: 75,
    borderRadius: 36,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -8,
    zIndex: 2,
  },
  nameLiquidGlassContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    overflow: 'hidden',
    zIndex: 1,
  },
  date: {
    fontSize: 13,
    fontWeight: '400',
    color: '#ffffff',
    opacity: 0.6,
    marginTop: spacing.xs,
  },
});
