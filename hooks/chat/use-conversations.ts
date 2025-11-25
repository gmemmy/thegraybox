import {useRouter} from 'expo-router';
import * as React from 'react';

import {getConversations, markRead as storeMarkRead} from '@/lib/state/mock-store';
import {compareByLastMessageDesc} from '@/lib/time/format';

export function useConversations() {
  const router = useRouter();
  const [data, setData] = React.useState(() =>
    [...getConversations()].sort(compareByLastMessageDesc),
  );

  React.useEffect(() => {
    setData([...getConversations()].sort(compareByLastMessageDesc));
  }, []);

  const markRead = React.useCallback((id: string) => {
    storeMarkRead(id);
    setData([...getConversations()].sort(compareByLastMessageDesc));
  }, []);

  const open = React.useCallback(
    (id: string) => {
      markRead(id);
      router.push({pathname: '/demos/chat/[id]', params: {id}});
    },
    [markRead, router],
  );

  return {data, open, markRead};
}
