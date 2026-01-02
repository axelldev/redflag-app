import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { colors } from "@/constants/colors";

interface Props {
  selectedImage: string | null;
}

export default function ImageUploadArea({ selectedImage }: Props) {
  return (
    <View style={styles.uploadArea}>
      {selectedImage ? (
        <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
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
  },
  imagePreview: {
    width: "100%",
    height: 400,
    resizeMode: "contain",
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
