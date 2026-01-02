import AnalyzeButton from "@/components/AnalyzeButton";
import ErrorAlert from "@/components/ErrorAlert";
import HowItWorks from "@/components/HowItWorks";
import ImageSourceButtons from "@/components/ImageSourceButtons";
import ImageUploadArea from "@/components/ImageUploadArea";
import LoadingIndicator from "@/components/LoadingIndicator";
import AnalysisResults from "@/components/results/AnalysisResults";
import { colors } from "@/constants/colors";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useProfileAnalysis } from "@/hooks/useProfileAnalysis";
import { Stack } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const {
    selectedImage,
    imageBase64,
    handleChooseFile,
    handleUseCamera,
    handlePasteClipboard,
  } = useImageUpload();

  const { analysis, isLoading, error, analyzeProfile } = useProfileAnalysis();

  const handleAnalyze = () => {
    if (imageBase64) {
      analyzeProfile(imageBase64);
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

        <ImageUploadArea selectedImage={selectedImage} />

        <ImageSourceButtons
          onChooseFile={handleChooseFile}
          onUseCamera={handleUseCamera}
          onPasteClipboard={handlePasteClipboard}
        />

        {selectedImage && (
          <AnalyzeButton
            onPress={handleAnalyze}
            isLoading={isLoading}
            disabled={!imageBase64 || isLoading}
          />
        )}

        {isLoading && (
          <LoadingIndicator message="Analyzing profile for red flags..." />
        )}

        {error && <ErrorAlert message={error} />}

        {analysis && <AnalysisResults analysis={analysis} />}

        <HowItWorks />
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
});
