import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TopBar() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]} pointerEvents="box-none">
      <View style={styles.pill}>
        <Text style={styles.pillText}>LIVE</Text>
      </View>
      <View style={styles.viewers}>
        <Text style={styles.viewersText}>1.2k</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,0,0,0.8)',
  },
  pillText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
  },
  viewers: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  viewersText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
});


