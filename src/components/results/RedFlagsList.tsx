import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import type { RedFlag } from "@/types/analysis";
import RedFlagCard from "./RedFlagCard";

interface Props {
  flags: RedFlag[];
}

export default function RedFlagsList({ flags }: Props) {
  if (flags.length === 0) {
    return (
      <View style={styles.cleanProfileContainer}>
        <View style={styles.cleanProfileContent}>
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={colors.success}
          />
          <Text style={styles.cleanProfileText}>
            No significant red flags detected! This profile appears genuine.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Red Flags Detected:</Text>
      {flags.map((flag, index) => (
        <RedFlagCard key={index} flag={flag} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  cleanProfileContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.surfaceElevated,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  cleanProfileContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cleanProfileText: {
    fontSize: 16,
    color: colors.success,
    flex: 1,
  },
});
