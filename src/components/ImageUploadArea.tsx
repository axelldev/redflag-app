import { colors } from "@/constants/colors";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

interface Props {
  selectedImage: string | null;
  onClear?: () => void;
}

export default function ImageUploadArea({ selectedImage, onClear }: Props) {
  return (
    <Animated.View layout={LinearTransition} style={styles.uploadArea}>
      {selectedImage ? (
        <Animated.View
          key="image-preview"
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
          style={{ width: "100%" }}
        >
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
          {onClear && (
            <Pressable
              style={({ pressed }) => [
                styles.clearButton,
                pressed && styles.clearButtonPressed,
              ]}
              onPress={onClear}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          )}
        </Animated.View>
      ) : (
        <Animated.View
          key="placeholder"
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
          style={styles.placeholder}
        >
          <Ionicons
            name="cloud-upload-outline"
            size={64}
            color={colors.textSecondary}
            style={styles.uploadIcon}
          />
          <Text style={styles.placeholderText}>Upload Screenshot</Text>
          <Text style={styles.placeholderSubtext}>
            Choose a file, use camera, or paste
          </Text>
        </Animated.View>
      )}
    </Animated.View>
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
  placeholder: {
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  uploadIcon: {
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
