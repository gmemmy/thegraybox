import {LegendList, type LegendListRef} from '@legendapp/list';
import * as React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';


import {spacing} from '@/theme/tokens';

import ChatBubble from './chat-bubble';

import type {ChatMessage, ChatMessageGroup} from '@/lib/chat/types';
import type {NativeScrollEvent, NativeSyntheticEvent,StyleProp, ViewStyle} from 'react-native';

type ChatListProps = {
  groups: ChatMessageGroup[];
  onScrollDistanceFromBottomChange?: (distance: number) => void;
  onContentSizeChange?: (width: number, height: number) => void;
  bottomInset: number;
  topInset?: number; // For header height
  listRef?: React.Ref<LegendListRef>;
  style?: StyleProp<ViewStyle>;
};

type ListItem = {
  id: string;
  message: ChatMessage;
  groupIndex: number;
  messageIndex: number;
  group: ChatMessageGroup;
};

const ChatList = React.forwardRef<LegendListRef, ChatListProps>(
  function ChatList(
    {
      groups,
      onScrollDistanceFromBottomChange,
      onContentSizeChange,
      bottomInset,
      topInset = 0,
      listRef,
      style,
    },
    ref,
  ) {
    const items = React.useMemo<ListItem[]>(() => {
      const result: ListItem[] = [];
      for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
        const group = groups[groupIndex];
        for (let messageIndex = 0; messageIndex < group.messages.length; messageIndex++) {
          const message = group.messages[messageIndex];
          result.push({
            id: message.id,
            message,
            groupIndex,
            messageIndex,
            group,
          });
        }
      }
      return result;
    }, [groups]);

    const renderItem = React.useCallback(
      ({item}: {item: ListItem}) => {
        const isFirstInGroup = item.messageIndex === 0;
        const isLastInGroup =
          item.messageIndex === item.group.messages.length - 1;

        return (
          <ChatBubble
            text={item.message.text}
            role={item.message.role}
            isFirstInGroup={isFirstInGroup}
            isLastInGroup={isLastInGroup}
            timestamp={item.message.createdAt}
            showTimestampBelow={isLastInGroup}
          />
        );
      },
      [],
    );

    const keyExtractor = React.useCallback((item: ListItem) => item.id, []);

    const handleScroll = React.useCallback(
      (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const {contentOffset, contentSize, layoutMeasurement} = e.nativeEvent;
        const distanceFromBottom =
          contentSize.height - (contentOffset.y + layoutMeasurement.height);
        onScrollDistanceFromBottomChange?.(distanceFromBottom);
      },
      [onScrollDistanceFromBottomChange],
    );

    const handleContentSizeChange = React.useCallback(
      (width: number, height: number) => {
        onContentSizeChange?.(width, height);
      },
      [onContentSizeChange],
    );

    return (
      <View style={[styles.container, style]}>
        <LegendList
          ref={ref || listRef}
          data={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={64}
          contentContainerStyle={[
            styles.contentContainer,
            {
              paddingTop: topInset,
              paddingBottom: bottomInset,
            },
          ]}
          onScroll={handleScroll}
          onContentSizeChange={handleContentSizeChange}
        />
      </View>
    );
  },
);

export default ChatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer: {
    paddingHorizontal: spacing.md,
  },
});
