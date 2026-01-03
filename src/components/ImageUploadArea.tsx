import { StyleSheet, Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { colors } from "@/constants/colors";

interface Props {
  selectedImage: string | null;
  onClear?: () => void;
}

export default function ImageUploadArea({ selectedImage, onClear }: Props) {
  return (
    <View style={styles.uploadArea}>
      {selectedImage ? (
        <>
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
          {onClear && (
            <Pressable
              style={({ pressed }) => [
                styles.clearButton,
                pressed && styles.clearButtonPressed,
              ]}
              onPress={onClear}
            >
              <Text style={styles.clearButtonText}>×</Text>
            </Pressable>
          )}
        </>
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.uploadIcon}>📤</Text>
          <Text style={styles.placeholderText}>Upload Screenshot</Text>
          <Text style={styles.placeholderSubtext}>
            Choose a file, use camera, or paste
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  uploadArea: {
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.surface,
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: 400,
    resizeMode: "contain",
  },
  clearButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  clearButtonPressed: {
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    transform: [{ scale: 0.95 }],
  },
  clearButtonText: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "300",
    lineHeight: 28,
  },
  placeholder: {
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  uploadIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
