import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

type Props = {
  facing: 'front' | 'back';
  isActive: boolean;
};

export default function CameraLayer({ facing, isActive }: Props) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice(facing);
  const [permissionChecked, setPermissionChecked] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      // Trigger permission status read; VisionCamera hook already does this
      if (mounted) setPermissionChecked(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onRequest = useCallback(async () => {
    try {
      await requestPermission();
    } catch {}
  }, [requestPermission]);

  if (!permissionChecked || !hasPermission) {
    return (
      <View style={styles.container}>
        <View style={styles.gate}>
          <Text style={styles.gateTitle}>Camera access needed</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Request Camera Permission" onPress={onRequest} style={styles.gateButton}>
            <Text style={styles.gateButtonText}>Allow Camera</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.container}>
        <View style={styles.gate}>
          <Text style={styles.gateTitle}>No camera device</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        photo={false}
        video={false}
        audio={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  gate: {
    position: 'absolute',
    left: 24,
    right: 24,
    top: '40%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
  },
  gateTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 12,
  },
  gateButton: {
    minHeight: 44,
    minWidth: 140,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gateButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});


