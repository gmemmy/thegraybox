import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {formatMessageTime} from '@/lib/time/format';
import {spacing} from '@/theme/tokens';

import type {StyleProp, ViewStyle} from 'react-native';

type ChatBubbleProps = {
  text: string;
  role: 'me' | 'other';
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  timestamp?: number;
  showTimestampBelow?: boolean;
  style?: StyleProp<ViewStyle>;
};

function ChatBubble({
  text,
  role,
  isFirstInGroup,
  isLastInGroup,
  timestamp,
  showTimestampBelow,
  style,
}: ChatBubbleProps) {
  const isSingle = isFirstInGroup && isLastInGroup;
  const isMiddle = !isFirstInGroup && !isLastInGroup;

  // Calculate border radius based on position in group (iOS iMessage style)
  // iOS uses ~18px radius for bubbles
  const iOS_BUBBLE_RADIUS = 18;
  const getBorderRadius = () => {
    if (role === 'me') {
      if (isSingle) {
        // Single: fully rounded but sharper bottom-right
        return {
          borderTopLeftRadius: iOS_BUBBLE_RADIUS,
          borderTopRightRadius: iOS_BUBBLE_RADIUS,
          borderBottomLeftRadius: iOS_BUBBLE_RADIUS,
          borderBottomRightRadius: 4,
        };
      }
      if (isFirstInGroup) {
        // First: sharpish bottom-right, rounded others
        return {
          borderTopLeftRadius: iOS_BUBBLE_RADIUS,
          borderTopRightRadius: iOS_BUBBLE_RADIUS,
          borderBottomLeftRadius: iOS_BUBBLE_RADIUS,
          borderBottomRightRadius: 4,
        };
      }
      if (isMiddle) {
        // Middle: both top-right and bottom-right more sharp
        return {
          borderTopLeftRadius: iOS_BUBBLE_RADIUS,
          borderTopRightRadius: 4,
          borderBottomLeftRadius: iOS_BUBBLE_RADIUS,
          borderBottomRightRadius: 4,
        };
      }
      // Last: top-right sharper, bottom-right rounded
      return {
        borderTopLeftRadius: iOS_BUBBLE_RADIUS,
        borderTopRightRadius: 4,
        borderBottomLeftRadius: iOS_BUBBLE_RADIUS,
        borderBottomRightRadius: iOS_BUBBLE_RADIUS,
      };
    }
    // Mirror logic for 'other' role
    if (isSingle) {
        // Single: fully rounded but sharper bottom-left
        return {
          borderTopLeftRadius: iOS_BUBBLE_RADIUS,
          borderTopRightRadius: iOS_BUBBLE_RADIUS,
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: iOS_BUBBLE_RADIUS,
        };
      }
      if (isFirstInGroup) {
        // First: sharpish bottom-left, rounded others
        return {
          borderTopLeftRadius: iOS_BUBBLE_RADIUS,
          borderTopRightRadius: iOS_BUBBLE_RADIUS,
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: iOS_BUBBLE_RADIUS,
        };
      }
      if (isMiddle) {
        // Middle: both top-left and bottom-left more sharp
        return {
          borderTopLeftRadius: 4,
          borderTopRightRadius: iOS_BUBBLE_RADIUS,
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: iOS_BUBBLE_RADIUS,
        };
      }
      // Last: top-left sharper, bottom-left rounded
      return {
        borderTopLeftRadius: 4,
        borderTopRightRadius: iOS_BUBBLE_RADIUS,
        borderBottomLeftRadius: iOS_BUBBLE_RADIUS,
        borderBottomRightRadius: iOS_BUBBLE_RADIUS,
      };
  };

  const borderRadius = getBorderRadius();
  const isMe = role === 'me';

  const formattedTime = React.useMemo(() => {
    if (timestamp) {
      return formatMessageTime(timestamp);
    }
    return undefined;
  }, [timestamp]);

  return (
    <View
      style={[
        styles.container,
        isMe ? styles.containerMe : styles.containerOther,
        style,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isMe ? styles.bubbleMe : styles.bubbleOther,
          borderRadius,
        ]}
      >
        <Text style={[styles.text, isMe ? styles.textMe : styles.textOther]}>
          {text}
        </Text>
      </View>
      {showTimestampBelow && formattedTime && (
        <Text
          style={[
            styles.timestamp,
            isMe ? styles.timestampMe : styles.timestampOther,
          ]}
        >
          {formattedTime}
        </Text>
      )}
    </View>
  );
}

export default React.memo(ChatBubble, (prevProps, nextProps) => {
  return (
    prevProps.text === nextProps.text &&
    prevProps.role === nextProps.role &&
    prevProps.isFirstInGroup === nextProps.isFirstInGroup &&
    prevProps.isLastInGroup === nextProps.isLastInGroup &&
    prevProps.timestamp === nextProps.timestamp &&
    prevProps.showTimestampBelow === nextProps.showTimestampBelow &&
    prevProps.style === nextProps.style
  );
});

const styles = StyleSheet.create({
  container: {
    maxWidth: '75%',
    marginVertical: 1,
  },
  containerMe: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  containerOther: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  bubbleMe: {
    backgroundColor: '#007AFF', 
  },
  bubbleOther: {
    backgroundColor: '#1C1C1E',
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
  },
  textMe: {
    color: '#ffffff',
  },
  textOther: {
    color: '#ffffff',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 2,
    color: '#8E8E93',
  },
  timestampMe: {
    textAlign: 'right',
    paddingRight: spacing.xs,
  },
  timestampOther: {
    textAlign: 'left',
    paddingLeft: spacing.xs,
  },
});
