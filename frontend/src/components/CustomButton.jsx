import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from "react-native";
import { colors } from "../constants/colors";
import { theme } from "../constants/theme";

export const CustomButton = ({
  title,
  onPress,
  variant = "primary", // "primary" | "secondary" | "outline" | "danger" | "google"
  size = "md", // "sm" | "md" | "lg"
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case "secondary":
        return styles.secondaryContainer;
      case "outline":
        return styles.outlineContainer;
      case "danger":
        return styles.dangerContainer;
      case "google":
        return styles.googleContainer;
      case "primary":
      default:
        return styles.primaryContainer;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "secondary":
        return styles.secondaryText;
      case "outline":
        return styles.outlineText;
      case "danger":
        return styles.dangerText;
      case "google":
        return styles.googleText;
      case "primary":
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case "sm":
        return styles.sizeSm;
      case "lg":
        return styles.sizeLg;
      case "md":
      default:
        return styles.sizeMd;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        getContainerStyle(),
        getSizeStyle(),
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" || variant === "google" ? colors.primary : "#FFFFFF"}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
          <Text style={[styles.baseText, getTextStyle(), textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    marginRight: 8,
  },
  baseText: {
    fontWeight: "600",
    textAlign: "center",
  },
  // Variants
  primaryContainer: {
    backgroundColor: colors.primary,
    ...theme.shadows.md,
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  secondaryContainer: {
    backgroundColor: colors.primaryLight,
  },
  secondaryText: {
    color: colors.primary,
    fontSize: 16,
  },
  outlineContainer: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  outlineText: {
    color: colors.primary,
    fontSize: 16,
  },
  dangerContainer: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  dangerText: {
    color: colors.danger,
    fontSize: 15,
  },
  googleContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    ...theme.shadows.sm,
  },
  googleText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "500",
  },
  // Sizes
  sizeSm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  sizeMd: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 22,
  },
  sizeLg: {
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 26,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default CustomButton;
