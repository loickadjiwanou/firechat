import React from "react";
import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import * as Haptics from "expo-haptics";

const Button = ({
  title,
  loading = false,
  iconLeft,
  iconRight,
  iconFamily = "Feather",
  variant = "contained",
  style = {},
  titleStyle = {},
  iconSize = 16,
  iconColor = "white",
  onPress,
  roundness = "medium",
  full = false,
  disabled = false,
}) => {
  const Icon = iconFamily === "Feather" ? Feather : Feather;

  const { Colors, Fonts, Styles } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles);

  const buttonStyles = [
    styles.button,
    styles[`${variant}Button`],
    styles[`${roundness}Roundness`],
    full && styles.fullWidth,
    (iconLeft || iconRight) && styles.withIconText,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${roundness}RoundnessText`],
    iconLeft && { marginLeft: 8 },
    iconRight && { marginRight: 8 },
    titleStyle,
  ];

  return (
    <Pressable
      // onPress={onPress}
      onPress={async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (onPress && !disabled) onPress();
      }}
      disabled={disabled}
      style={({ pressed }) => [
        buttonStyles,
        pressed && styles.buttonPressed,
        pressed && styles.shadow,
      ]}
      hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
    >
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <>
          {iconLeft && (
            <Icon name={iconLeft} size={iconSize} color={iconColor} />
          )}
          <Text style={textStyles}>{title}</Text>
          {iconRight && (
            <Icon name={iconRight} size={iconSize} color={iconColor} />
          )}
        </>
      )}
    </Pressable>
  );
};

const createStyles = (Colors, Fonts, Styles) =>
  StyleSheet.create({
    button: {
      height: 40,
      minWidth: 64,
      borderRadius: Styles.borderRadius.xs,
      paddingHorizontal: Styles.padding.lg,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    text: {
      fontSize: Fonts.sizes.lg,
      fontFamily: Fonts.family.FredokaMedium,
      color: Colors.white,
      textAlign: "center",
    },
    withIconText: {
      flexDirection: "row",
      alignItems: "center",
    },
    fullWidth: {
      width: "100%",
    },
    buttonPressed: {
      opacity: 0.9,
    },
    shadow: {
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
  });

export default Button;
