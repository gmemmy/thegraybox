import {LegendList, type LegendListRef} from '@legendapp/list';
import * as React from 'react';
import {type NativeScrollEvent, type NativeSyntheticEvent, Platform, View} from 'react-native';
import {
  AndroidSoftInputModes,
  KeyboardController,
  KeyboardGestureArea,
} from 'react-native-keyboard-controller';

import MessageBubble from './message-bubble';

import type {Message} from '@/types/chat';

type Props = {
  messages: Message[];
  onReachEndChange?: (atEnd: boolean) => void;
  composerBottomPadding: number;
  onScrollMetrics?: (contentHeight: number, offsetY: number, viewportHeight: number) => void;
  onNearTopLoadOlder?: () => void;
  provideJumpToBottom?: (fn: () => void) => void;
};

const Thread = React.memo(function Thread({
  messages,
  onReachEndChange,
  composerBottomPadding,
  onScrollMetrics,
  onNearTopLoadOlder,
  provideJumpToBottom,
}: Props) {
  const listRef = React.useRef<LegendListRef>(null);

  React.useLayoutEffect(() => {
    if (Platform.OS === 'android') {
      KeyboardController.setInputMode(AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE);
    }
  }, []);

  const renderItem = React.useCallback(
    ({item}: {item: Message}) => <MessageBubble message={item} />,
    [],
  );

  React.useEffect(() => {
    if (provideJumpToBottom) {
      provideJumpToBottom(() => {
        listRef.current?.scrollToEnd?.({animated: true});
      });
    }
  }, [provideJumpToBottom]);

  const handleScroll = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const {contentOffset, contentSize, layoutMeasurement} = e.nativeEvent;
      const distanceFromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);
      onReachEndChange?.(distanceFromBottom <= 60);
      onScrollMetrics?.(contentSize.height, contentOffset.y, layoutMeasurement.height);
    },
    [onReachEndChange, onScrollMetrics],
  );

  return (
    <View style={{flex: 1}}>
      {Platform.OS === 'android' ? (
        <KeyboardGestureArea interpolator="ios" style={{flex: 1}}>
          <LegendList
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item: Message) => item.id}
            estimatedItemSize={64}
            alignItemsAtEnd
            maintainScrollAtEnd
            maintainVisibleContentPosition
            onStartReached={() => onNearTopLoadOlder?.()}
            onStartReachedThreshold={0.1}
            contentContainerStyle={{paddingBottom: composerBottomPadding}}
            onScroll={handleScroll}
            ref={listRef}
          />
        </KeyboardGestureArea>
      ) : (
        <LegendList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item: Message) => item.id}
          estimatedItemSize={64}
          alignItemsAtEnd
          maintainScrollAtEnd
          maintainVisibleContentPosition
          onStartReached={() => onNearTopLoadOlder?.()}
          onStartReachedThreshold={0.1}
          contentContainerStyle={{paddingBottom: composerBottomPadding}}
          onScroll={handleScroll}
          ref={listRef}
        />
      )}
    </View>
  );
});

export default Thread;
