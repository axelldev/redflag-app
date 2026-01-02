import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";

interface Props {
  message?: string;
}

export default function LoadingIndicator({ message }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message && <Text style={styles.text}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: "center",
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
});
