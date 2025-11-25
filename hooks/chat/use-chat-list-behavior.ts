import * as React from 'react';

import {Chat, useChatStore} from '@/lib/chat/domain';
import {useChatLayoutStore} from '@/lib/chat/layout';

import type {ChatThreadId} from '@/lib/chat/types';
import type { LegendListRef } from '@legendapp/list'

type UseChatListBehaviorParams = {
  threadId: ChatThreadId;
  listRef: React.RefObject<LegendListRef>;
};

type UseChatListBehaviorResult = {
  handleScrollDistanceChange: (distanceFromBottom: number) => void;
  handleContentSizeChange: (w: number, h: number) => void;
  isAtBottom: boolean;
  unreadCount: number;
  showNewMessagesPill: boolean;
  scrollToEnd: (options?: {animated?: boolean}) => void;
  handleNewMessagesPillPress: () => void;
};

const AT_BOTTOM_THRESHOLD = 16;

export function useChatListBehavior({
  threadId,
  listRef,
}: UseChatListBehaviorParams): UseChatListBehaviorResult {
  const isAtBottomSelector = React.useMemo(
    () => Chat.selectors.isAtBottom(threadId),
    [threadId],
  );
  const unreadCountSelector = React.useMemo(
    () => Chat.selectors.unreadCount(threadId),
    [threadId],
  );
  const isAtBottom = Chat.useStore(isAtBottomSelector);
  const unreadCount = Chat.useStore(unreadCountSelector);
  const setDistanceFromBottom = useChatLayoutStore(
    (state) => state.setDistanceFromBottom,
  );

  const handleScrollDistanceChange = React.useCallback(
    (distanceFromBottom: number) => {
      setDistanceFromBottom(distanceFromBottom);

      const newIsAtBottom = distanceFromBottom <= AT_BOTTOM_THRESHOLD;
      const currentIsAtBottom = useChatStore.getState().isAtBottomByThread[threadId] ?? false;
      if (newIsAtBottom !== currentIsAtBottom) {
        Chat.actions.setIsAtBottom(threadId, newIsAtBottom);
      }
    },
    [threadId, setDistanceFromBottom],
  );

  const handleContentSizeChange = React.useCallback(
    (_w: number, _h: number) => {
      // Placeholder for future content size handling if needed
    },
    [],
  );

  const scrollToEnd = React.useCallback(
    (options?: {animated?: boolean}) => {
      const animated = options?.animated ?? true;
      listRef.current?.scrollToEnd?.({animated});
    },
    [listRef],
  );

  const handleNewMessagesPillPress = React.useCallback(() => {
    scrollToEnd({animated: true});
    Chat.actions.resetUnread(threadId);
  }, [threadId, scrollToEnd]);

  const showNewMessagesPill = !isAtBottom && unreadCount > 0;

  return {
    handleScrollDistanceChange,
    handleContentSizeChange,
    isAtBottom,
    unreadCount,
    showNewMessagesPill,
    scrollToEnd,
    handleNewMessagesPillPress,
  };
}
