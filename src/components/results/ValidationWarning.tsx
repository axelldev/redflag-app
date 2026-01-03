import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";

interface Props {
  message: string;
}

export default function ValidationWarning({ message }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="warning" size={20} color={colors.warning} />
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.surfaceElevated,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    color: colors.warning,
    fontSize: 16,
    flex: 1,
  },
});
