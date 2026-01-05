import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  hasImage: boolean;
  hasAnalysis: boolean;
  isLoading: boolean;
  onNewAnalysis: () => void;
  onReanalyze: () => void;
  onClear: () => void;
}

export default function BottomActionBar({
  hasImage,
  hasAnalysis,
  isLoading,
  onNewAnalysis,
  onReanalyze,
  onClear,
}: Props) {
  const insets = useSafeAreaInsets();

  // Don't show anything if no image is selected
  if (!hasImage) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.buttonRow}>
        {/* New Analysis Button */}
        <Pressable
          style={[styles.button, styles.secondaryButton]}
          onPress={onNewAnalysis}
          disabled={isLoading}
        >
          <Text style={styles.secondaryButtonText}>New Analysis</Text>
        </Pressable>

        {/* Re-analyze Button (only show if analysis exists) */}
        {hasAnalysis && (
          <Pressable
            style={[styles.button, styles.primaryButton]}
            onPress={onReanalyze}
            disabled={isLoading}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? "Analyzing..." : "Re-analyze"}
            </Text>
          </Pressable>
        )}

        {/* Clear Button */}
        <Pressable
          style={[styles.button, styles.tertiaryButton]}
          onPress={onClear}
          disabled={isLoading}
        >
          <Text style={styles.tertiaryButtonText}>Clear</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tertiaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  tertiaryButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "500",
  },
});
