import * as React from 'react';

import {Chat} from '@/lib/chat/domain';

import type {ChatMessageId, ChatThreadId} from '@/lib/chat/types';

type UseChatSendAnimationResult = {
  lastSentMessageId: ChatMessageId | null;
};

export function useChatSendAnimation(
  threadId: ChatThreadId,
): UseChatSendAnimationResult {
  const messagesSelector = React.useMemo(
    () => Chat.selectors.messages(threadId),
    [threadId],
  );
  const messages = Chat.useStore(messagesSelector);
  const [lastSentMessageId, setLastSentMessageId] =
    React.useState<ChatMessageId | null>(null);
  const previousMessagesLengthRef = React.useRef<number>(0);
  const previousLastSentIdRef = React.useRef<ChatMessageId | null>(null);

  React.useEffect(() => {
    const lastSentMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === 'me');

    const currentLastSentId = lastSentMessage?.id ?? null;
    const messagesLength = messages.length;

    const hasNewMessage =
      messagesLength > previousMessagesLengthRef.current ||
      currentLastSentId !== previousLastSentIdRef.current;

    if (hasNewMessage && currentLastSentId) {
      setLastSentMessageId(currentLastSentId);
      previousLastSentIdRef.current = currentLastSentId;
    }

    previousMessagesLengthRef.current = messagesLength;
  }, [messages]);

  return {
    lastSentMessageId,
  };
}
