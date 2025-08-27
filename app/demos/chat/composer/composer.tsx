import {MaterialIcons} from '@expo/vector-icons';
import * as React from 'react';
import {Pressable, StyleSheet, TextInput, View} from 'react-native';

import {colors} from '@/theme/colors';

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  onSend: () => void;
};

const Composer = React.memo(function Composer({value, onChangeText, onSend}: Props) {
  const canSend = value.trim().length > 0;
  const handleSend = React.useCallback(() => {
    if (!canSend) return;
    onSend();
  }, [canSend, onSend]);

  return (
    <View style={styles.container}>
      <Pressable accessibilityRole="button" style={styles.leadingButton}>
        <MaterialIcons name="add" size={24} color={colors.backgroundDark} />
      </Pressable>

      <View style={styles.pill}>
        <TextInput
          accessibilityLabel="Message"
          multiline
          placeholder="Message"
          placeholderTextColor={colors.nike.gray}
          value={value}
          style={styles.input}
          onChangeText={onChangeText}
        />
        <Pressable
          accessibilityRole="button"
          onPress={handleSend}
          disabled={!canSend}
          style={[styles.trailingButton, !canSend && {opacity: 0.4}]}
        >
          <MaterialIcons name="multitrack-audio" size={24} color={colors.backgroundDark} />
        </Pressable>
      </View>
    </View>
  );
});

export default Composer;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  leadingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  leadingIcon: {
    color: colors.backgroundDark,
    fontSize: 18,
    fontWeight: '600',
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingLeft: 12,
    paddingRight: 6,
  },
  input: {
    width: '90%',
    minHeight: 40,
    maxHeight: 24 * 4,
    paddingVertical: 10,
    justifyContent: 'center',
    color: colors.backgroundDark,
  },
  trailingButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trailingIcon: {
    color: colors.backgroundDark,
    fontSize: 16,
  },
});
