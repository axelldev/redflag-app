import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";

interface Props {
  message: string;
}

export default function ValidationWarning({ message }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>⚠️ {message}</Text>
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
  text: {
    color: colors.warning,
    fontSize: 16,
  },
});
