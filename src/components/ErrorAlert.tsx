import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";

interface Props {
  message: string;
}

export default function ErrorAlert({ message }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>❌ {message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.surfaceElevated,
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
  },
  text: {
    color: colors.danger,
    fontSize: 16,
  },
});
