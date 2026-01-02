import { Camera } from "expo-camera";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";

const formatBase64 = (base64: string) => {
  return base64.includes(",") ? base64.split(",")[1] : base64;
};

export const useImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const handleChooseFile = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const base64 = result.assets[0].base64;
        const uri = result.assets[0].uri;
        if (!base64) {
          throw new Error("Failed to get base64");
        }
        setSelectedImage(uri);
        setImageBase64(base64);
      }
    } catch {
      Alert.alert("Error", "Failed to select image");
    }
  };

  const handleUseCamera = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Camera access is required to take photos"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const base64 = result.assets[0].base64;
        const uri = result.assets[0].uri;
        if (!base64) {
          throw new Error("Failed to get base64");
        }
        setSelectedImage(uri);
        setImageBase64(base64);
      }
    } catch {
      Alert.alert("Error", "Failed to capture photo");
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const hasImage = await Clipboard.hasImageAsync();
      if (!hasImage) {
        Alert.alert(
          "No Image Found",
          "Clipboard does not contain an image. Copy an image first, then try again."
        );
        return;
      }

      const image = await Clipboard.getImageAsync({ format: "jpeg" });
      if (image && image.data) {
        const base64 = formatBase64(image.data);
        setSelectedImage(image.data);
        setImageBase64(base64);
      }
    } catch {
      Alert.alert("Error", "Failed to paste image from clipboard");
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImageBase64(null);
  };

  return {
    selectedImage,
    imageBase64,
    handleChooseFile,
    handleUseCamera,
    handlePasteClipboard,
    clearImage,
  };
};
