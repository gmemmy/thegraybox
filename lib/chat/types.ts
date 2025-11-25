export type ChatRole = 'me' | 'other';

export type ChatMessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';

export type ChatMessageId = string;

export type ChatThreadId = string;

export type ChatMessage = {
  id: ChatMessageId;
  threadId: ChatThreadId;
  role: ChatRole;
  text: string;
  createdAt: number;
  status: ChatMessageStatus;
};

export type ChatMessageGroup = {
  id: string;
  threadId: ChatThreadId;
  role: ChatRole;
  messages: ChatMessage[];
  createdAt: number;
  lastUpdatedAt: number;
};

export type ChatThreadMetadata = {
  id: ChatThreadId;
  participantName: string;
  participantAvatar?: string;
  lastActivityAt: number;
};

export type Conversation = {
  id: string;
  title: string;
  participants: string[];
  lastMessage: {text: string; timestamp: number};
  unreadCount: number;
};
