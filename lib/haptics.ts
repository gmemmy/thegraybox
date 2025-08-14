// Safe wrappers for expo-haptics
export async function selection() {
  try {
    const Haptics = await import('expo-haptics');
    await Haptics.selectionAsync();
  } catch {}
}

export async function success() {
  try {
    const Haptics = await import('expo-haptics');
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {}
}
