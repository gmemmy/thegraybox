import {MaterialIcons} from '@expo/vector-icons';
import * as React from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Chat} from '@/lib/chat/domain';
import {colors} from '@/theme/colors';
import {radii, spacing} from '@/theme/tokens';

import LiquidGlassContainer from './liquid-glass-container';

import type {ChatThreadId} from '@/lib/chat/types';
// Max height for ~5-6 lines (assuming ~20px line height)
const MAX_INPUT_HEIGHT = 20 * 5;

type ChatComposerProps = {
  threadId: ChatThreadId;
  onHeightChange?: (height: number) => void;
};

function ChatComposer({threadId, onHeightChange}: ChatComposerProps) {
  const composerTextSelector = React.useMemo(
    () => Chat.selectors.composerText(threadId),
    [threadId],
  );
  const composerText = Chat.useStore(composerTextSelector);
  const insets = useSafeAreaInsets();
  const previousHeightRef = React.useRef<number>(0);

  const handleChangeText = React.useCallback(
    (text: string) => {
      Chat.actions.setComposerText(threadId, text);
    },
    [threadId],
  );

  const handleSend = React.useCallback(() => {
    const trimmed = composerText.trim();
    if (!trimmed) {
      return;
    }
    Chat.actions.sendUserMessage(threadId);
  }, [threadId, composerText]);

  const canSend = composerText.trim().length > 0;

  const handleLayout = React.useCallback(
    (e: {nativeEvent: {layout: {height: number}}}) => {
      const height = e.nativeEvent.layout.height;
      if (onHeightChange && height !== previousHeightRef.current) {
        previousHeightRef.current = height;
        onHeightChange(height);
      }
    },
    [onHeightChange],
  );

  return (
    <View
      style={[
        styles.inputContainer,
        {
          marginBottom: Math.max(insets.bottom, spacing.sm),
        },
      ]}
      onLayout={handleLayout}
    >
      <View style={styles.inputContent}>
        <LiquidGlassContainer
          style={styles.attachButtonGlassContainer}
          fallbackStyle={styles.fallbackContainer}
        >
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Add attachment"
            style={styles.attachButtonInner}
          >
            <MaterialIcons name="add" size={24} color="#ffffff" />
          </TouchableOpacity>
        </LiquidGlassContainer>
        <LiquidGlassContainer
          style={styles.textInputGlassContainer}
          fallbackStyle={styles.fallbackContainer}
        >
          <TextInput
            accessibilityLabel="Message"
            multiline
            placeholder="iMessage"
            placeholderTextColor={colors.nike.gray}
            value={composerText}
            onChangeText={handleChangeText}
            style={[styles.input, {maxHeight: MAX_INPUT_HEIGHT}]}
            scrollEnabled={true}
            textAlignVertical="center"
            blurOnSubmit={false}
            returnKeyType="default"
          />
        </LiquidGlassContainer>
        <LiquidGlassContainer
          style={styles.actionButtonGlassContainer}
          fallbackStyle={styles.fallbackContainer}
        >
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={canSend ? 'Send message' : 'Voice message'}
            onPress={canSend ? handleSend : undefined}
            disabled={!canSend}
            style={[styles.actionButtonInner, !canSend && styles.actionButtonDisabled]}
          >
            {canSend ? (
              <MaterialIcons name="send" size={20} color="#ffffff" />
            ) : (
              <MaterialIcons name="mic" size={24} color="#ffffff" />
            )}
          </TouchableOpacity>
        </LiquidGlassContainer>
      </View>
    </View>
  );
}

export default React.memo(ChatComposer);

const styles = StyleSheet.create({
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    zIndex: 10,
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  attachButtonGlassContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachButtonInner: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputGlassContainer: {
    flex: 1,
    minHeight: 36,
    borderRadius: radii.full,
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  input: {
    fontSize: 16,
    lineHeight: 20,
    color: '#ffffff',
    minHeight: 20,
  },
  actionButtonGlassContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonInner: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  fallbackContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});
