export type Conversation = {
  id: string;
  title: string;
  participants: string[];
  lastMessage: {text: string; timestamp: number};
  unreadCount: number;
};

export type Message = {
  id: string;
  convId: string;
  authorId: string;
  kind: 'text';
  text: string;
  sentAt: number;
  status: 'sending' | 'sent';
};
