import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";

interface Props {
  onChooseFile: () => void;
  onUseCamera: () => void;
  onPasteClipboard: () => void;
  disabled?: boolean;
}

export default function ImageSourceButtons({
  onChooseFile,
  onUseCamera,
  onPasteClipboard,
  disabled = false,
}: Props) {
  return (
    <View style={styles.buttonGroup}>
      <Pressable
        style={[styles.button, styles.primaryButton]}
        onPress={onChooseFile}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>📁 Choose File</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={onUseCamera}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>📷 Use Camera</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={onPasteClipboard}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>📋 Paste from Clipboard</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonGroup: {
    paddingHorizontal: 16,
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
});
