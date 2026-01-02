import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";

interface Props {
  score: number;
}

export default function RiskScore({ score }: Props) {
  const getScoreColor = (score: number) => {
    if (score > 60) return colors.danger;
    if (score > 30) return colors.warning;
    return colors.success;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Risk Score</Text>
      <Text style={[styles.value, { color: getScoreColor(score) }]}>
        {score}/100
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.surfaceElevated,
  },
  label: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 32,
    fontWeight: "bold",
  },
});
