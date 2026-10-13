import colors from "./colors";

export const theme = {
  colors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    pill: 9999,
  },
  typography: {
    titleLarge: {
      fontSize: 26,
      fontWeight: "700",
      color: colors.text,
      lineHeight: 32,
    },
    titleMedium: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      lineHeight: 26,
    },
    titleSmall: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      lineHeight: 22,
    },
    bodyLarge: {
      fontSize: 15,
      fontWeight: "400",
      color: colors.textSecondary,
      lineHeight: 22,
    },
    bodyMedium: {
      fontSize: 14,
      fontWeight: "400",
      color: colors.textSecondary,
      lineHeight: 20,
    },
    bodySmall: {
      fontSize: 12,
      fontWeight: "400",
      color: colors.textMuted,
      lineHeight: 16,
    },
    caption: {
      fontSize: 11,
      fontWeight: "500",
      color: colors.textMuted,
    },
  },
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 4,
    },
    lg: {
      shadowColor: "#0D5C4D",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 6,
    },
  },
};

export default theme;
