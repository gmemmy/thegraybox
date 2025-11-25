import {create} from 'zustand';

import type {
  ChatMessage,
  ChatMessageGroup,
  ChatThreadId,
  ChatThreadMetadata,
} from './types';

// Simple ID generator that doesn't require crypto
// Uses timestamp + random number for uniqueness
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

type ChatStore = {
  messagesByThread: Record<ChatThreadId, ChatMessage[]>;
  composerTextByThread: Record<ChatThreadId, string>;
  isAtBottomByThread: Record<ChatThreadId, boolean>;
  unreadCountByThread: Record<ChatThreadId, number>;
  threadMetadataByThread: Record<ChatThreadId, ChatThreadMetadata>;
  setComposerText: (threadId: ChatThreadId, text: string) => void;
  sendUserMessage: (threadId: ChatThreadId) => void;
  receiveMessage: (threadId: ChatThreadId, payload: {text: string}) => void;
  setIsAtBottom: (threadId: ChatThreadId, isAtBottom: boolean) => void;
  resetUnread: (threadId: ChatThreadId) => void;
};

// Simple ID generator for seed data (doesn't require crypto)
function generateSeedId(threadId: string, index: number): string {
  return `seed-${threadId}-${index}-${Date.now()}`;
}

const seedDemoMessages = (threadId: ChatThreadId): ChatMessage[] => {
  const now = Date.now();
  const messages: ChatMessage[] = [];
  let timestamp = now - 2 * 60 * 60 * 1000; // 2 hours ago

  // Add many messages for performance testing
  const messageTemplates = [
    {role: 'other' as const, text: 'Hey! How are you doing?'},
    {role: 'me' as const, text: 'Doing great, thanks for asking!'},
    {role: 'other' as const, text: 'That\'s awesome to hear!'},
    {role: 'me' as const, text: 'What about you? How has your day been?'},
    {role: 'other' as const, text: 'Pretty good! Just working on some projects.'},
    {role: 'me' as const, text: 'Nice! What kind of projects?'},
    {role: 'other' as const, text: 'Some React Native stuff, you know how it is 😄'},
    {role: 'me' as const, text: 'Haha yeah, always something interesting to build!'},
    {role: 'other' as const, text: 'Exactly! The ecosystem is constantly evolving.'},
    {role: 'me' as const, text: 'I love how fast things move in this space.'},
    {role: 'other' as const, text: 'Me too! Have you tried the new architecture yet?'},
    {role: 'me' as const, text: 'Not yet, but I\'m planning to migrate soon.'},
    {role: 'other' as const, text: 'It\'s worth it for the performance improvements.'},
    {role: 'me' as const, text: 'That\'s what I\'ve heard. Any tips for migration?'},
    {role: 'other' as const, text: 'Start with a small feature and test thoroughly.'},
    {role: 'me' as const, text: 'Good advice, thanks!'},
    {role: 'other' as const, text: 'No problem! Happy to help anytime.'},
    {role: 'me' as const, text: 'Appreciate it! Let me know if you need anything too.'},
    {role: 'other' as const, text: 'Will do! Talk soon.'},
    {role: 'me' as const, text: 'Sounds good! 👋'},
  ];

  // Generate ~1000 messages for performance testing
  const initialMessages: {role: 'me' | 'other'; text: string}[] = [];
  for (let i = 0; i < 1000; i++) {
    const template = messageTemplates[i % messageTemplates.length];
    const variation = i > 0 && i % 50 === 0 ? ` (batch ${Math.floor(i / 50)})` : '';
    initialMessages.push({
      role: template.role,
      text: template.text + variation,
    });
  }

  for (let i = 0; i < initialMessages.length; i++) {
    const msg = initialMessages[i];
    messages.push({
      id: generateSeedId(threadId, i),
      threadId,
      role: msg.role,
      text: msg.text,
      createdAt: timestamp,
      status: msg.role === 'me' ? 'sent' : 'delivered',
    });
    timestamp += 3 * 60 * 1000; // +3 minutes between messages
  }

  return messages;
};

// Seed messages for common demo thread IDs
const seedInitialThreads = (): Record<ChatThreadId, ChatMessage[]> => {
  const threads: Record<ChatThreadId, ChatMessage[]> = {};
  const commonThreadIds: ChatThreadId[] = ['demo-thread', 'c1'];
  
  for (const threadId of commonThreadIds) {
    threads[threadId] = seedDemoMessages(threadId);
  }
  
  return threads;
};

// Seed thread metadata for demo threads
const seedThreadMetadata = (): Record<ChatThreadId, ChatThreadMetadata> => {
  const now = Date.now();
  return {
    'demo-thread': {
      id: 'demo-thread',
      participantName: 'Alex',
      participantAvatar: undefined, // Can add avatar later
      lastActivityAt: now,
    },
    'c1': {
      id: 'c1',
      participantName: 'Jordan',
      participantAvatar: undefined,
      lastActivityAt: now,
    },
  };
};

export const useChatStore = create<ChatStore>((set, get) => {
  return {
    messagesByThread: seedInitialThreads(),
    composerTextByThread: {},
    isAtBottomByThread: {
      'demo-thread': true, // Start at bottom
      'c1': true, // Start at bottom
    },
    unreadCountByThread: {},
    threadMetadataByThread: seedThreadMetadata(),

    setComposerText: (threadId, text) => {
    set((state) => ({
      composerTextByThread: {
        ...state.composerTextByThread,
        [threadId]: text,
      },
    }));
  },

  sendUserMessage: (threadId) => {
    const state = get();
    const text = state.composerTextByThread[threadId]?.trim() ?? '';

    if (!text) {
      return;
    }

    const message: ChatMessage = {
      id: generateId(),
      threadId,
      role: 'me',
      text,
      createdAt: Date.now(),
      status: 'sent',
    };

    const existingMessages = state.messagesByThread[threadId] ?? [];

    set((prevState) => ({
      messagesByThread: {
        ...prevState.messagesByThread,
        [threadId]: [...existingMessages, message],
      },
      composerTextByThread: {
        ...prevState.composerTextByThread,
        [threadId]: '',
      },
    }));
  },

  receiveMessage: (threadId, payload) => {
    const state = get();
    const message: ChatMessage = {
      id: generateId(),
      threadId,
      role: 'other',
      text: payload.text,
      createdAt: Date.now(),
      status: 'delivered',
    };

    const existingMessages = state.messagesByThread[threadId] ?? [];
    const isAtBottom = state.isAtBottomByThread[threadId] === true;
    const currentUnread = state.unreadCountByThread[threadId] ?? 0;

    set((prevState) => ({
      messagesByThread: {
        ...prevState.messagesByThread,
        [threadId]: [...existingMessages, message],
      },
      unreadCountByThread: {
        ...prevState.unreadCountByThread,
        [threadId]: isAtBottom ? currentUnread : currentUnread + 1,
      },
    }));
  },

  setIsAtBottom: (threadId, isAtBottom) => {
    set((state) => ({
      isAtBottomByThread: {
        ...state.isAtBottomByThread,
        [threadId]: isAtBottom,
      },
    }));
  },

  resetUnread: (threadId) => {
    set((state) => ({
      unreadCountByThread: {
        ...state.unreadCountByThread,
        [threadId]: 0,
      },
    }));
  },
  };
});

// Empty array constant to avoid creating new arrays
const EMPTY_MESSAGES: ChatMessage[] = [];

export const selectMessages =
  (threadId: ChatThreadId) =>
  (state: ChatStore): ChatMessage[] => {
    // Return the actual array from the store if it exists
    // Only use EMPTY_MESSAGES if the thread doesn't exist
    const messages = state.messagesByThread[threadId];
    if (messages) {
      return messages;
    }
    return EMPTY_MESSAGES;
  };

export const selectComposerText =
  (threadId: ChatThreadId) =>
  (state: ChatStore): string => {
    return state.composerTextByThread[threadId] ?? '';
  };

export const selectIsAtBottom =
  (threadId: ChatThreadId) =>
  (state: ChatStore): boolean => {
    return state.isAtBottomByThread[threadId] ?? false;
  };

export const selectUnreadCount =
  (threadId: ChatThreadId) =>
  (state: ChatStore): number => {
    return state.unreadCountByThread[threadId] ?? 0;
  };

export const selectThreadMetadata =
  (threadId: ChatThreadId) =>
  (state: ChatStore): ChatThreadMetadata | null => {
    return state.threadMetadataByThread[threadId] ?? null;
  };

export function groupMessagesBySender(
  messages: ChatMessage[],
): ChatMessageGroup[] {
  if (messages.length === 0) {
    return [];
  }

  const groups: ChatMessageGroup[] = [];
  let currentGroup: ChatMessageGroup | null = null;

  for (const message of messages) {
    if (
      currentGroup === null ||
      currentGroup.role !== message.role ||
      currentGroup.threadId !== message.threadId
    ) {
      // Start a new group
      currentGroup = {
        id: generateId(),
        threadId: message.threadId,
        role: message.role,
        messages: [message],
        createdAt: message.createdAt,
        lastUpdatedAt: message.createdAt,
      };
      groups.push(currentGroup);
    } else {
      // Add to existing group
      currentGroup.messages.push(message);
      currentGroup.lastUpdatedAt = message.createdAt;
    }
  }

  return groups;
}

export const Chat = {
  useStore: useChatStore,
  selectors: {
    messages: selectMessages,
    composerText: selectComposerText,
    isAtBottom: selectIsAtBottom,
    unreadCount: selectUnreadCount,
    threadMetadata: selectThreadMetadata,
  },
  actions: {
    setComposerText: (threadId: ChatThreadId, text: string) =>
      useChatStore.getState().setComposerText(threadId, text),
    sendUserMessage: (threadId: ChatThreadId) =>
      useChatStore.getState().sendUserMessage(threadId),
    receiveMessage: (threadId: ChatThreadId, payload: {text: string}) =>
      useChatStore.getState().receiveMessage(threadId, payload),
    setIsAtBottom: (threadId: ChatThreadId, isAtBottom: boolean) =>
      useChatStore.getState().setIsAtBottom(threadId, isAtBottom),
    resetUnread: (threadId: ChatThreadId) =>
      useChatStore.getState().resetUnread(threadId),
  },
} as const;
