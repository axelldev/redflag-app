import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";

export default function HowItWorks() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How it works</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginTop: 32,
    padding: 20,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  title: {
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
