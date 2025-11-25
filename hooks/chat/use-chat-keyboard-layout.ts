import * as React from 'react';
import {useKeyboardHandler} from 'react-native-keyboard-controller';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {runOnJS} from 'react-native-worklets';

import {
  getBottomInset,
  useChatLayoutStore,
} from '@/lib/chat/layout';

import type {LayoutChangeEvent} from 'react-native';

type UseChatKeyboardLayoutParams = {
  onComposerHeightChange?: (height: number) => void;
};

type UseChatKeyboardLayoutResult = {
  bottomInset: number;
  handleComposerLayout: (event: LayoutChangeEvent) => void;
};

const EXTRA_BLANK_SPACE = 8;

export function useChatKeyboardLayout({
  onComposerHeightChange,
}: UseChatKeyboardLayoutParams = {}): UseChatKeyboardLayoutResult {
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeightState] = React.useState(0);
  const setKeyboardHeight = useChatLayoutStore(
    (state) => state.setKeyboardHeight,
  );
  const setComposerHeight = useChatLayoutStore(
    (state) => state.setComposerHeight,
  );
  const composerHeight = useChatLayoutStore(
    (state) => state.composerHeight,
  );

  // Update keyboard height in store (JS thread)
  const updateKeyboardHeight = React.useCallback(
    (height: number) => {
      setKeyboardHeightState(height);
      setKeyboardHeight(height);
    },
    [setKeyboardHeight],
  );

  useKeyboardHandler(
    {
      onStart: (e) => {
        'worklet';
        const height = e.height ?? 0;
        runOnJS(updateKeyboardHeight)(height);
      },
      onMove: (e) => {
        'worklet';
        const height = e.height ?? 0;
        runOnJS(updateKeyboardHeight)(height);
      },
      onEnd: (e) => {
        'worklet';
        const height = e.height ?? 0;
        runOnJS(updateKeyboardHeight)(height);
      },
    },
    [updateKeyboardHeight],
  );

  const handleComposerLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      const height = event.nativeEvent.layout.height;
      setComposerHeight(height);
      onComposerHeightChange?.(height);
    },
    [setComposerHeight, onComposerHeightChange],
  );

  const bottomInset = React.useMemo(
    () =>
      getBottomInset({
        keyboardHeight,
        composerHeight,
        safeAreaBottom: insets.bottom,
        extraBlankSpace: EXTRA_BLANK_SPACE,
      }),
    [keyboardHeight, composerHeight, insets.bottom],
  );

  return {
    bottomInset,
    handleComposerLayout,
  };
}
