import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useChatKeyboardLayout} from '@/hooks/chat/use-chat-keyboard-layout';
import {useChatListBehavior} from '@/hooks/chat/use-chat-list-behavior';
import {useChatSendAnimation} from '@/hooks/chat/use-chat-send-animation';
import {Chat, groupMessagesBySender} from '@/lib/chat/domain';

import ChatComposer from './chat-composer';
import ChatHeader from './chat-header';
import ChatList from './chat-list';
import ChatNewMessagesPill from './chat-new-messages-pill';

import type {ChatThreadId} from '@/lib/chat/types';
import type {LegendListRef} from '@legendapp/list';
import type {LayoutChangeEvent} from 'react-native';


type ChatScaffoldProps = {
  threadId: ChatThreadId;
};

function ChatScaffold({threadId}: ChatScaffoldProps) {
  const insets = useSafeAreaInsets();
  const messagesSelector = React.useMemo(
    () => Chat.selectors.messages(threadId),
    [threadId],
  );
  const messages = Chat.useStore(messagesSelector);
  const groups = React.useMemo(
    () => groupMessagesBySender(messages),
    [messages],
  );

  const listRef = React.useRef<LegendListRef>(null) as React.RefObject<LegendListRef>;
  useChatSendAnimation(threadId); // Track last sent message for future animation
  const {bottomInset, handleComposerLayout} = useChatKeyboardLayout();
  const {
    handleScrollDistanceChange,
    handleContentSizeChange,
    showNewMessagesPill,
    unreadCount,
    handleNewMessagesPillPress,
  } = useChatListBehavior({threadId, listRef});

  // Header height: 56px + safe area top
  const headerHeight = 56 + insets.top;

  return (
    <View style={styles.container}>
      <ChatHeader threadId={threadId} />
      <ChatList
        groups={groups}
        bottomInset={bottomInset}
        topInset={headerHeight}
        listRef={listRef}
        onScrollDistanceFromBottomChange={handleScrollDistanceChange}
        onContentSizeChange={handleContentSizeChange}
      />
      <ChatNewMessagesPill
        visible={showNewMessagesPill}
        count={unreadCount}
        onPress={handleNewMessagesPillPress}
      />
      <ChatComposer
        threadId={threadId}
        onHeightChange={(height) => {
          const syntheticEvent = {
            nativeEvent: {
              layout: {
                x: 0,
                y: 0,
                width: 0,
                height,
              },
            },
          } as LayoutChangeEvent;
          handleComposerLayout(syntheticEvent);
        }}
      />
    </View>
  );
}

export default React.memo(ChatScaffold);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
