import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import CameraLayer from './camera-layer';
import ChatOverlay from './chat-overlay/chat-overlay';
import ReactionsEmitter from './reactions/emitter';
import TopBar from './hud/top-bar';
import Controls from './hud/controls';

export type CameraFacing = 'front' | 'back';

export default function StreamScreen() {
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [areReactionsVisible, setAreReactionsVisible] = useState(true);
  const [facing, setFacing] = useState<CameraFacing>('back');
  const [isFocused, setIsFocused] = useState(true);

  useFocusEffect(() => {
    setIsFocused(true);
    return () => setIsFocused(false);
  });

  return (
    <View style={styles.container}>
      <CameraLayer facing={facing} isActive={isFocused} />

      {isChatVisible && (
        <View pointerEvents="none" style={styles.overlayFull}>
          <ChatOverlay />
        </View>
      )}

      {areReactionsVisible && (
        <View pointerEvents="none" style={styles.overlayFull}>
          <ReactionsEmitter />
        </View>
      )}

      <TopBar />
      <Controls
        facing={facing}
        onFlip={() => setFacing((p) => (p === 'back' ? 'front' : 'back'))}
        isChatVisible={isChatVisible}
        onToggleChat={() => setIsChatVisible((v) => !v)}
        areReactionsVisible={areReactionsVisible}
        onToggleReactions={() => setAreReactionsVisible((v) => !v)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  overlayFull: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});


