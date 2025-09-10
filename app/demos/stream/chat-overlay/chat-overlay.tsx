import { View, StyleSheet } from 'react-native';

export default function ChatOverlay() {
  return <View style={styles.surface} />;
}

const styles = StyleSheet.create({
  surface: {
    flex: 1,
    backgroundColor: 'rgba(0, 128, 255, 0.08)',
  },
});


