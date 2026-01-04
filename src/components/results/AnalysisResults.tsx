import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import type { AnalysisResponse } from "@/types/analysis";
import RiskScore from "./RiskScore";
import ValidationWarning from "./ValidationWarning";
import RedFlagsList from "./RedFlagsList";

interface Props {
  analysis: AnalysisResponse;
}

export default function AnalysisResults({ analysis }: Props) {
  const getPlatformDisplay = (platform: string) => {
    const displays: Record<string, string> = {
      'X': '𝕏',
      'Instagram': 'Instagram',
      'LinkedIn': 'LinkedIn',
      'Facebook': 'Facebook',
      'TikTok': 'TikTok',
      'Other': 'Social Media',
      'Unknown': 'Unknown Platform'
    };
    return displays[platform] || platform;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analysis Results</Text>

        <Text style={styles.platformBadge}>
          {getPlatformDisplay(analysis.platform)} {analysis.contentType}
        </Text>

        <RiskScore score={analysis.overallScore} />
      </View>

      {!analysis.isValid && (
        <ValidationWarning message={analysis.validationMessage} />
      )}

      {analysis.isValid && (
        <>
          <Text style={styles.summary}>{analysis.summary}</Text>
          <RedFlagsList flags={analysis.redFlags} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  platformBadge: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    fontWeight: '500',
  },
  summary: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
    lineHeight: 24,
  },
});
