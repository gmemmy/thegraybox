import {Entypo} from '@expo/vector-icons';
import {useLocalSearchParams, useRouter} from 'expo-router';
import * as React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {KeyboardStickyView} from 'react-native-keyboard-controller';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useComposer} from '@/hooks/use-composer';
import {useThread} from '@/hooks/use-thread';
import {getChatAvatarForConv} from '@/lib/registry/chat';
import {normalizeParam} from '@/lib/router';
import {getConversationById} from '@/lib/state/mock-store';
import {colors} from '@/theme/colors';

import NewMessagesPill from './components/new-messages-pill';
import Thread from './components/thread';
import Composer from './composer/composer';

const COMPOSER_HEIGHT = 40;

export default function ChatsThreadDemoScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const id = React.useMemo(() => normalizeParam(params.id) ?? '', [params.id]);
  const {
    messages,
    sendText,
    setAtBottom,
    onScrollMetrics,
    unseenCount,
    resetUnseen,
    setIncomingEnabled: _setIncomingEnabled,
    isAtBottom,
    loadOlder,
  } = useThread(id);
  const {draft, setDraft} = useComposer(id);
  const insets = useSafeAreaInsets();
  const stickyOffset = Math.max(0, insets.bottom) + 40;
  const [composerHeight, setComposerHeight] = React.useState(48);
  const convo = getConversationById(id);
  const avatar = getChatAvatarForConv(id);
  const jumpToBottomRef = React.useRef<(() => void) | null>(null);

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, {paddingTop: insets.top + 8}]}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, {top: insets.top + 8 + 32 - 18}]}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Entypo name="chevron-small-left" size={24} color={colors.background} />
        </Pressable>
        {avatar ? <Image source={avatar} style={styles.avatar} /> : null}
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {convo?.title ?? id}
          </Text>
        </View>
      </View>
      <Thread
        messages={messages}
        onReachEndChange={(atEnd) => setAtBottom(atEnd)}
        composerBottomPadding={composerHeight}
        onScrollMetrics={onScrollMetrics}
        onNearTopLoadOlder={() => {
          loadOlder();
        }}
        provideJumpToBottom={(fn) => {
          jumpToBottomRef.current = fn;
        }}
      />
      {unseenCount > 0 && !isAtBottom ? (
        <View
          pointerEvents="box-none"
          style={{position: 'absolute', left: 0, right: 0, bottom: composerHeight + 8}}
        >
          <NewMessagesPill
            count={unseenCount}
            onPress={() => {
              resetUnseen();
              jumpToBottomRef.current?.();
              setAtBottom(true);
            }}
          />
        </View>
      ) : null}
      <KeyboardStickyView offset={stickyOffset}>
        <View
          onLayout={(e) => setComposerHeight(e.nativeEvent.layout.height)}
          style={{paddingBottom: COMPOSER_HEIGHT}}
        >
          <Composer
            value={draft}
            onChangeText={setDraft}
            onSend={() => {
              const text = draft.trim();
              if (!text) return;
              sendText(text);
              setDraft('');
            }}
          />
        </View>
      </KeyboardStickyView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00000055',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {fontSize: 22, fontWeight: '600', color: colors.background},
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 6,
  },
  title: {
    color: colors.background,
  },
  titleContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 18,
  },
});
