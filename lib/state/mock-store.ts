import type {Conversation} from '@/lib/chat/types';

export type Message = {
  id: string;
  convId: string;
  authorId: string;
  kind: 'text';
  text: string;
  sentAt: number;
  status: 'sending' | 'sent';
};

const now = Date.now();

const conversationsSeed: Conversation[] = [
  {
    id: 'c1',
    title: 'Ava Chen',
    participants: ['me', 'u1'],
    lastMessage: {text: 'See you at 7?', timestamp: now - 2 * 60_000},
    unreadCount: 1,
  },
  {
    id: 'c2',
    title: 'Team Sync',
    participants: ['me', 'u2', 'u3', 'u4'],
    lastMessage: {text: 'Draft shared in Drive', timestamp: now - 20 * 60_000},
    unreadCount: 0,
  },
  {
    id: 'c3',
    title: 'Jamie',
    participants: ['me', 'u5'],
    lastMessage: {text: 'Perfect, thanks!', timestamp: now - 6 * 60_000},
    unreadCount: 0,
  },
  {
    id: 'c4',
    title: 'Parents',
    participants: ['me', 'u6', 'u7'],
    lastMessage: {text: 'Call when free', timestamp: now - 4 * 60 * 60_000},
    unreadCount: 2,
  },
  {
    id: 'c5',
    title: 'Alex',
    participants: ['me', 'u8'],
    lastMessage: {text: 'Coffee tomorrow?', timestamp: now - 50 * 60_000},
    unreadCount: 0,
  },
  {
    id: 'c6',
    title: 'Design Group',
    participants: ['me', 'u9', 'u10'],
    lastMessage: {text: 'v2 looks great', timestamp: now - 5 * 60_000},
    unreadCount: 3,
  },
];

// 40 messages for c1
const messagesSeed: Message[] = (() => {
  const list: Message[] = [];
  const convId = 'c1';
  let t = now - 120 * 60_000; // 2 hours ago
  for (let i = 0; i < 40; i++) {
    const isMe = i % 2 === 0;
    list.push({
      id: `m${i + 1}`,
      convId,
      authorId: isMe ? 'me' : 'u1',
      kind: 'text',
      text: isMe ? `My message #${i + 1}` : `Their reply #${i + 1}`,
      sentAt: t,
      status: 'sent',
    });
    t += 3 * 60_000; // +3 minutes
  }
  return list;
})();

// Store messages by conversation id
const messagesByConvId: Record<string, Message[]> = {
  c1: messagesSeed,
};

export function getConversations(): readonly Conversation[] {
  return conversationsSeed;
}

export function getConversationById(convId: string): Conversation | undefined {
  return conversationsSeed.find((c) => c.id === convId);
}

export function getMessagesForConversation(convId: string): readonly Message[] {
  return messagesByConvId[convId] ?? [];
}

export function markRead(convId: string): void {
  const found = conversationsSeed.find((c) => c.id === convId);
  if (found) found.unreadCount = 0;
}

export function appendMessage(message: Message): void {
  if (!messagesByConvId[message.convId]) messagesByConvId[message.convId] = [];
  const list = messagesByConvId[message.convId] as Message[];
  list.push(message);
  const found = conversationsSeed.find((c) => c.id === message.convId);
  if (found) {
    found.lastMessage = {text: message.text, timestamp: message.sentAt};
  }
}

export function updateMessageStatus(
  convId: string,
  messageId: string,
  status: Message['status'],
): void {
  const list = messagesByConvId[convId];
  if (!list) return;
  const msg = list.find((m) => m.id === messageId);
  if (msg) msg.status = status;
}

export function getOldestTimestamp(convId: string): number | undefined {
  const list = messagesByConvId[convId];
  if (!list || list.length === 0) return undefined;
  let min = list[0].sentAt;
  for (let i = 1; i < list.length; i++) {
    if (list[i].sentAt < min) min = list[i].sentAt;
  }
  return min;
}

export function prependOlderMessages(convId: string, count = 20): number {
  if (!messagesByConvId[convId]) messagesByConvId[convId] = [];
  const list = messagesByConvId[convId] as Message[];
  const oldest = getOldestTimestamp(convId) ?? Date.now();
  const startAt = oldest - 3 * 60_000; // 3 minutes before the oldest
  const added: Message[] = [];
  for (let i = 0; i < count; i++) {
    const id = `old-${convId}-${startAt - i * 3 * 60_000}`;
    added.push({
      id,
      convId,
      authorId: i % 2 === 0 ? 'u1' : 'me',
      kind: 'text',
      text: i % 2 === 0 ? `Earlier reply #${i + 1}` : `Earlier message #${i + 1}`,
      sentAt: startAt - i * 3 * 60_000,
      status: 'sent',
    });
  }
  // Prepend while keeping ascending order
  messagesByConvId[convId] = [...added, ...list];
  return added.length;
}
