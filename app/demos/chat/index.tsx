import {Stack} from 'expo-router';
import * as React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

import ConversationList from './components/conversation-list';
import {useConversations} from '../../../hooks/use-conversations';

export default function ChatsDemoScreen() {
  const {data, open} = useConversations();

  const handleOpen = React.useCallback(
    (id: string) => {
      open(id);
    },
    [open],
  );

  const conversations = React.useMemo(() => data, [data]);

  return (
    <>
      <Stack.Screen options={{headerShown: false}} />
      <SafeAreaView mode="padding" edges={['top']} style={{flex: 1}}>
        <ConversationList conversations={conversations} onPressRow={handleOpen} />
      </SafeAreaView>
    </>
  );
}
