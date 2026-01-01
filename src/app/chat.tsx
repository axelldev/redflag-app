import { colors } from "@/constants/colors";
import type { AnalysisResponse } from "@/types/analysis";
import { Camera } from "expo-camera";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Chat() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        if (!base64) {
          throw new Error("Failed to get base64");
        }
        setSelectedImage(base64);
        setAnalysis(null);
        setError(null);
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
        if (!base64) {
          throw new Error("Failed to get base64");
        }
        setSelectedImage(base64);
        setImageBase64(base64);
        setAnalysis(null);
        setError(null);
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
        const dataUrl = image.data;
        const base64 = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
        setSelectedImage(dataUrl);
        setImageBase64(base64);
        setAnalysis(null);
        setError(null);
      }
    } catch {
      Alert.alert("Error", "Failed to paste image from clipboard");
    }
  };

  const handleAnalyze = async () => {
    if (!imageBase64) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageBase64,
          mediaType: "image/jpeg",
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data: AnalysisResponse = await response.json();
      setAnalysis(data);
    } catch {
      setError("Failed to analyze profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Red Flag Analyzer",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Analyze Twitter/X Profiles</Text>
          <Text style={styles.subtitle}>
            Upload a screenshot to detect potential red flags
          </Text>
        </View>

        <View style={styles.uploadArea}>
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={styles.imagePreview}
            />
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

        <View style={styles.buttonGroup}>
          <Pressable
            style={[styles.button, styles.primaryButton]}
            onPress={handleChooseFile}
          >
            <Text style={styles.buttonText}>📁 Choose File</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={handleUseCamera}>
            <Text style={styles.buttonText}>📷 Use Camera</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={handlePasteClipboard}>
            <Text style={styles.buttonText}>📋 Paste from Clipboard</Text>
          </Pressable>
        </View>

        {selectedImage && (
          <Pressable
            style={[styles.button, styles.analyzeButton]}
            onPress={handleAnalyze}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Analyzing..." : "Analyze Profile"}
            </Text>
          </Pressable>
        )}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>
              Analyzing profile for red flags...
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        )}

        {analysis && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Analysis Results</Text>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>Risk Score</Text>
                <Text
                  style={[
                    styles.scoreValue,
                    {
                      color:
                        analysis.overallScore > 60
                          ? colors.danger
                          : analysis.overallScore > 30
                          ? colors.warning
                          : colors.success,
                    },
                  ]}
                >
                  {analysis.overallScore}/100
                </Text>
              </View>
            </View>

            {!analysis.isValid && (
              <View style={styles.invalidContainer}>
                <Text style={styles.invalidText}>
                  ⚠️ {analysis.validationMessage}
                </Text>
              </View>
            )}

            {analysis.isValid && (
              <>
                <Text style={styles.summary}>{analysis.summary}</Text>

                {analysis.redFlags.length > 0 ? (
                  <View style={styles.redFlagsContainer}>
                    <Text style={styles.redFlagsTitle}>
                      Red Flags Detected:
                    </Text>
                    {analysis.redFlags.map((flag, index) => (
                      <View
                        key={index}
                        style={[
                          styles.flagCard,
                          {
                            borderLeftColor:
                              flag.severity === "high"
                                ? colors.danger
                                : flag.severity === "medium"
                                ? colors.warning
                                : colors.success,
                          },
                        ]}
                      >
                        <View style={styles.flagHeader}>
                          <Text style={styles.flagCategory}>
                            {flag.category}
                          </Text>
                          <View
                            style={[
                              styles.severityBadge,
                              {
                                backgroundColor:
                                  flag.severity === "high"
                                    ? colors.danger
                                    : flag.severity === "medium"
                                    ? colors.warning
                                    : colors.success,
                              },
                            ]}
                          >
                            <Text style={styles.severityText}>
                              {flag.severity.toUpperCase()}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.flagEvidence}>
                          Evidence: {flag.evidence}
                        </Text>
                        <Text style={styles.flagAnalysis}>{flag.analysis}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.cleanProfileContainer}>
                    <Text style={styles.cleanProfileText}>
                      ✅ No significant red flags detected! This profile appears
                      genuine.
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        )}

        <View style={styles.howItWorksContainer}>
          <Text style={styles.howItWorksTitle}>How it works</Text>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>1.</Text>
            <Text style={styles.stepText}>
              Upload, paste, or capture a screenshot
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>2.</Text>
            <Text style={styles.stepText}>
              AI analyzes for potential red flags
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>3.</Text>
            <Text style={styles.stepText}>
              Review detailed analysis and risk score
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
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
  analyzeButton: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    padding: 32,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.surfaceElevated,
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: 16,
  },
  resultsContainer: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  resultHeader: {
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.surfaceElevated,
  },
  scoreLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: "bold",
  },
  invalidContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.surfaceElevated,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  invalidText: {
    color: colors.warning,
    fontSize: 16,
  },
  summary: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
    lineHeight: 24,
  },
  redFlagsContainer: {
    marginTop: 8,
  },
  redFlagsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  flagCard: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.surfaceElevated,
    borderLeftWidth: 4,
  },
  flagHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  flagCategory: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  severityText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
  },
  flagEvidence: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    fontStyle: "italic",
  },
  flagAnalysis: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  cleanProfileContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.surfaceElevated,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  cleanProfileText: {
    fontSize: 16,
    color: colors.success,
  },
  howItWorksContainer: {
    margin: 16,
    marginTop: 32,
    padding: 20,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  howItWorksTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginRight: 12,
    width: 24,
  },
  stepText: {
    fontSize: 16,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 22,
  },
});
