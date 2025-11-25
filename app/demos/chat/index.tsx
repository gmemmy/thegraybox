import {MaterialIcons} from '@expo/vector-icons';
import {Stack} from 'expo-router';
import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import ConversationList from '@/components/chat/conversation-list';
import {useConversations} from '@/hooks/chat/use-conversations';
import {colors} from '@/theme/colors';

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
      <SafeAreaView mode="padding" edges={['top']} style={styles.container}>
        <View style={styles.header}>
          <Text accessibilityRole="header" style={styles.headerTitle}>
            Messages
          </Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerActionPill}>
              <Text style={styles.headerActionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerActionPill}>
              <MaterialIcons name="filter-list" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <ConversationList conversations={conversations} onPressRow={handleOpen} />
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 15,
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 44,
    fontWeight: '800',
    color: colors.backgroundDark,
  },
  headerActions: {
    position: 'absolute',
    right: 12,
    top: 8,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  headerActionPill: {
    backgroundColor: '#00000055',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  headerActionText: {
    color: colors.background,
    fontWeight: '700',
  },
});
