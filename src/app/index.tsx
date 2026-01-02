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
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const insets = useSafeAreaInsets();

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
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <Text style={styles.subtitle}>
          Upload an X profile screenshot to detect red flags
        </Text>

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
  glassHeader: {
    paddingHorizontal: 24,
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
