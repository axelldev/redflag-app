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
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analysis Results</Text>
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
    marginBottom: 12,
  },
  summary: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
    lineHeight: 24,
  },
});
