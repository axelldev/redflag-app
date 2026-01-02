import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import type { RedFlag } from "@/types/analysis";

interface Props {
  flag: RedFlag;
}

export default function RedFlagCard({ flag }: Props) {
  const getBorderColor = (severity: string) => {
    if (severity === "high") return colors.danger;
    if (severity === "medium") return colors.warning;
    return colors.success;
  };

  const getBadgeColor = (severity: string) => {
    if (severity === "high") return colors.danger;
    if (severity === "medium") return colors.warning;
    return colors.success;
  };

  return (
    <View
      style={[
        styles.card,
        { borderLeftColor: getBorderColor(flag.severity) },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.category}>{flag.category}</Text>
        <View
          style={[
            styles.severityBadge,
            { backgroundColor: getBadgeColor(flag.severity) },
          ]}
        >
          <Text style={styles.severityText}>
            {flag.severity.toUpperCase()}
          </Text>
        </View>
      </View>
      <Text style={styles.evidence}>Evidence: {flag.evidence}</Text>
      <Text style={styles.analysis}>{flag.analysis}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.surfaceElevated,
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  category: {
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
  evidence: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    fontStyle: "italic",
  },
  analysis: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
