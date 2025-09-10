import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  facing: 'front' | 'back';
  onFlip: () => void;
  isChatVisible: boolean;
  onToggleChat: () => void;
  areReactionsVisible: boolean;
  onToggleReactions: () => void;
};

export default function Controls({ facing, onFlip, isChatVisible, onToggleChat, areReactionsVisible, onToggleReactions }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 12 }]} pointerEvents="box-none">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Flip Camera"
        onPress={onFlip}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{facing === 'back' ? 'Flip: Front' : 'Flip: Back'}</Text>
      </Pressable>

      <View style={styles.rightGroup}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Toggle Chat Overlay"
          onPress={onToggleChat}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{isChatVisible ? 'Chat: On' : 'Chat: Off'}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Toggle Reactions Overlay"
          onPress={onToggleReactions}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{areReactionsVisible ? 'React: On' : 'React: Off'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    minHeight: 44,
    minWidth: 80,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
});


