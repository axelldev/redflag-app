import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "@/constants/colors";

interface Props {
  onPress: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export default function AnalyzeButton({ onPress, isLoading, disabled }: Props) {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>
        {isLoading ? "Analyzing..." : "Analyze Profile"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
});
