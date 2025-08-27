import {LegendList} from '@legendapp/list';
import * as React from 'react';
import {View} from 'react-native';

import ConversationRow from './conversation-row';

import type {Conversation} from '@/hooks/use-conversations';

export type {Conversation};

type Props = {
  conversations: Conversation[];
  onPressRow: (id: string) => void;
};

const ConversationList = React.memo(function ConversationList({conversations, onPressRow}: Props) {
  const data = React.useMemo(() => conversations, [conversations]);
  const renderItem = React.useCallback(
    ({item}: {item: Conversation}) => <ConversationRow item={item} onPress={onPressRow} />,
    [onPressRow],
  );

  if (data.length === 0) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View>
          <View style={{alignItems: 'center'}}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: '#eee',
                marginBottom: 12,
              }}
            />
            <View style={{width: 200, height: 12, backgroundColor: '#f1f1f1', borderRadius: 6}} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <LegendList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item: Conversation) => item.id}
        estimatedItemSize={80}
      />
    </View>
  );
});

export default ConversationList;
