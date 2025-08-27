import * as React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

import {getChatAvatarForConv} from '@/lib/registry/chat';
import {formatRelativeTime} from '@/lib/time/format';
import {colors} from '@/theme/colors';

import type {Conversation} from '@/hooks/use-conversations';

type Props = {
  item: Conversation;
  onPress: (id: string) => void;
};

const ConversationRow = React.memo(function ConversationRow({item, onPress}: Props) {
  const handlePress = React.useCallback(() => onPress(item.id), [item.id, onPress]);
  const time = React.useMemo(
    () => formatRelativeTime(item.lastMessage.timestamp),
    [item.lastMessage.timestamp],
  );
  const unreadLabel = React.useMemo(() => {
    if (!item.unreadCount) return undefined;
    return item.unreadCount > 9 ? '9+' : String(item.unreadCount);
  }, [item.unreadCount]);
  const avatar = getChatAvatarForConv(item.id);
  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${time}${item.unreadCount ? `, ${item.unreadCount} unread` : ''}`}
    >
      <View style={styles.container}>
        {avatar ? (
          <Image source={avatar} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarPlaceholderText}>{item.title.slice(0, 1)}</Text>
          </View>
        )}
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={styles.title}>
              {item.title}
            </Text>
            <Text style={styles.time}>{time}</Text>
          </View>
          <View style={styles.messageContainer}>
            <Text numberOfLines={1} style={styles.message}>
              {item.lastMessage.text}
            </Text>
            {unreadLabel ? (
              <View style={styles.unreadLabel}>
                <Text style={styles.unreadLabelText}>{unreadLabel}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
});

export default ConversationRow;

const styles = StyleSheet.create({
  container: {
    minHeight: 72,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  avatarPlaceholder: {
    backgroundColor: '#e6e6e6',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholderText: {
    fontWeight: '600',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    marginLeft: 8,
    fontSize: 12,
    color: '#888',
    flexShrink: 0,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  message: {
    flex: 1,
    color: '#666',
  },
  unreadLabel: {
    marginLeft: 8,
    paddingHorizontal: 6,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadLabelText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '700',
  },
});
