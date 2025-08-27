import {useCallback, useEffect, useRef, useState} from 'react';

import {
  appendMessage,
  getMessagesForConversation,
  prependOlderMessages,
  updateMessageStatus,
} from '@/lib/state/mock-store';

import type {Message} from '@/types/chat';

export function useThread(convId: string) {
  const [version, setVersion] = useState(0); // TODO: replace with subscription when moving off mock store
  const atBottomRef = useRef(true);
  const [distanceToBottom, setDistanceToBottom] = useState(0);
  const [unseenCount, setUnseenCount] = useState(0);
  const [incomingEnabled, setIncomingEnabled] = useState(false);

  const list = getMessagesForConversation(convId);
  const messages = [...list].sort((a, b) => a.sentAt - b.sentAt);

  const setAtBottom = useCallback((isAtBottom: boolean) => {
    atBottomRef.current = isAtBottom;
  }, []);

  const onScrollMetrics = useCallback(
    (contentHeight: number, offsetY: number, viewportHeight: number) => {
      const dist = Math.max(0, contentHeight - (offsetY + viewportHeight));
      setDistanceToBottom(dist);
      const atBottom = dist <= 80;
      setAtBottom(atBottom);
      if (atBottom && unseenCount) setUnseenCount(0);
    },
    [setAtBottom, unseenCount],
  );

  const sendText = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const tempId = `temp-${Date.now()}`;
      const now = Date.now();
      const optimistic: Message = {
        id: tempId,
        convId,
        authorId: 'me',
        kind: 'text',
        text: trimmed,
        sentAt: now,
        status: 'sending',
      };
      appendMessage(optimistic);
      setVersion((v) => v + 1);

      setTimeout(() => {
        updateMessageStatus(convId, tempId, 'sent');
        setVersion((v) => v + 1);
      }, 600);
    },
    [convId],
  );

  const loadOlder = useCallback(() => {
    const added = prependOlderMessages(convId, 20);
    if (added > 0) setVersion((v) => v + 1);
  }, [convId]);

  useEffect(() => {
    if (!incomingEnabled) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      if (cancelled) return;
      const delay = 2000 + Math.floor(Math.random() * 2000);
      timer = setTimeout(() => {
        const now = Date.now();
        appendMessage({
          id: `inc-${now}`,
          convId,
          authorId: 'u1',
          kind: 'text',
          text: 'Incoming message',
          sentAt: now,
          status: 'sent',
        });
        setVersion((v) => v + 1);
        if (!atBottomRef.current) setUnseenCount((c) => c + 1);
        tick();
      }, delay);
    };
    tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [incomingEnabled, convId]);

  const resetUnseen = useCallback(() => setUnseenCount(0), []);

  return {
    messages,
    sendText,
    loadOlder,
    isAtBottom: atBottomRef.current,
    setAtBottom,
    onScrollMetrics,
    distanceToBottom,
    unseenCount,
    resetUnseen,
    incomingEnabled,
    setIncomingEnabled,
  } as const;
}
