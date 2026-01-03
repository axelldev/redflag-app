import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
        <View style={styles.buttonContent}>
          <Ionicons name="folder-open" size={20} color={colors.text} />
          <Text style={styles.buttonText}>Choose File</Text>
        </View>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={onUseCamera}
        disabled={disabled}
      >
        <View style={styles.buttonContent}>
          <Ionicons name="camera" size={20} color={colors.text} />
          <Text style={styles.buttonText}>Use Camera</Text>
        </View>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={onPasteClipboard}
        disabled={disabled}
      >
        <View style={styles.buttonContent}>
          <Ionicons name="clipboard" size={20} color={colors.text} />
          <Text style={styles.buttonText}>Paste from Clipboard</Text>
        </View>
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
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
});
