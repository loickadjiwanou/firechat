import { useColorScheme as _useColorScheme } from "react-native";

export const Colors = {
  light: {
    black: "#000000",
    white: "#ffffff",
    transparent: "transparent",
    background: "#ffffff",
    backgroundClear: "#CAD7E7",
    bw: "#000000",
    wb: "#ffffff",
    lightgray: "#f5f5f5",
    gray: "#808080",
    gray2: "#b3b3b3ff",
    text: "#OOOOOO",
    primaryBlue: "#2196F3",
    primaryYellow: "#FFC107",
    primaryGray: "#9B9893",
    baseGray05: "#F5F3EE",
    baseGray80: "#30302E",
    highlightLabel: "#312F2D",
    baseLabel: "#9B9893",
    success: "#4CAF50",
    error: "#F44336",
    info: "#2196F3",
    warning: "#FF9800",
    backgroundtoast: "#333",
  },
  dark: {
    black: "#000000",
    white: "#ffffff",
    transparent: "transparent",
    background: "#000000",
    backgroundClear: "#000000",
    bw: "#ffffff",
    wb: "#000000",
    lightgray: "#f5f5f5",
    gray: "#808080",
    gray2: "#b3b3b3ff",
    text: "#ffffff",
    primaryBlue: "#2196F3",
    primaryYellow: "#FFC107",
    primaryGray: "#9B9893",
    baseGray05: "#30302E",
    baseGray80: "#30302E",
    highlightLabel: "#312F2D",
    baseLabel: "#9B9893",
    success: "#4CAF50",
    error: "#F44336",
    info: "#2196F3",
    warning: "#FF9800",
    backgroundtoast: "#333",
  },
};

export const Fonts = {
  family: {
    FredokaRegular: "FredokaRegular",
    FredokaMedium: "FredokaMedium",
  },
  sizes: {
    x: 10,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    xlg: 50,
  },
};

export const Styles = {
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    xlg: 50,
  },
  padding: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    xlg: 50,
  },
  margin: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    xlg: 50,
  },
  shadow: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    xlg: 50,
  },
  elevation: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    xlg: 50,
  },
  opacity: {
    none: 0,
    xs: 0.1,
    sm: 0.2,
    md: 0.3,
    lg: 0.4,
    xl: 0.5,
    xxl: 0.6,
    xxxl: 0.7,
    xlg: 0.8,
    full: 1,
  },
  size: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    xxg: 40,
    xlg: 50,
  },
};

export function useColorScheme() {
  return _useColorScheme();
}

export function useTheme() {
  const theme = useColorScheme() ?? "light";

  const color = (name, props = {}) => {
    const colorFromProps = props[theme];
    if (colorFromProps) return colorFromProps;
    return Colors[theme][name];
  };

  return {
    theme, // 'light' ou 'dark'
    Colors: Colors[theme], // actual theme colors
    Fonts, // polices
    Styles, // styles
    color, // function to get a color from the theme
  };
}
