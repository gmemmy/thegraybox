import {useLocalSearchParams} from 'expo-router';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import ChatScaffold from '@/components/chat/chat-scaffold';
import {normalizeParam} from '@/lib/router';

export default function ChatsThreadDemoScreen() {
  const params = useLocalSearchParams();
  const threadId = React.useMemo(
    () => normalizeParam(params.id) ?? 'demo-thread',
    [params.id],
  );

  return (
    <View style={styles.container}>
      <ChatScaffold threadId={threadId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
