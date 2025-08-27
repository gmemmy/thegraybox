import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {formatRelativeTime} from '@/lib/time/format';
import {colors} from '@/theme/colors';

import type {Message} from '@/types/chat';

type Props = {
  message: Message;
};

const MessageBubble = React.memo(function MessageBubble({message}: Props) {
  const isMe = message.authorId === 'me';
  const time = formatRelativeTime(message.sentAt);
  return (
    <View style={[styles.container, {justifyContent: isMe ? 'flex-end' : 'flex-start'}]}>
      <View style={[styles.messageContainer, isMe ? styles.outgoing : styles.incoming]}>
        <Text style={[styles.messageText, isMe ? styles.outgoingText : styles.incomingText]}>
          {message.text}
        </Text>
        <Text style={[styles.messageTime, isMe ? styles.outgoingTime : styles.incomingTime]}>
          {isMe ? (message.status === 'sending' ? 'sending · ' : 'sent · ') : ''}
          {time}
        </Text>
      </View>
    </View>
  );
});

export default MessageBubble;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: 'row',
  },
  messageContainer: {
    maxWidth: '78%',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  outgoing: {backgroundColor: colors.primary},
  incoming: {backgroundColor: colors.background},
  messageText: {},
  outgoingText: {color: colors.background},
  incomingText: {color: colors.backgroundDark},
  messageTime: {
    marginTop: 4,
    fontSize: 10,
  },
  outgoingTime: {color: 'rgba(255,255,255,0.8)'},
  incomingTime: {color: '#666'},
});
