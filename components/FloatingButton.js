import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Octicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FloatingButton({ from, icon, text, onPress }) {
  const { top, bottom } = useSafeAreaInsets();
  const { Colors, Fonts, Styles, theme } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles, bottom);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
      onPress={onPress}
      style={styles.view}
    >
      <Octicons name={icon} size={24} color={Colors.white} />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (Colors, Fonts, Styles, bottom) =>
  StyleSheet.create({
    view: {
      position: "absolute",
      bottom: bottom + 75,
      right: 10,
      backgroundColor: Colors.primaryBlue,
      paddingVertical: 20,
      width: 150,
      borderRadius: 20,
      justifyContent: "space-between",
      paddingHorizontal: 20,
      alignItems: "center",
      shadowColor: Colors.black,
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 5,
      elevation: 5,
      flexDirection: "row",
      gap: 6,
    },
    text: {
      color: Colors.white,
      fontSize: Fonts.sizes.xl,
      fontFamily: Fonts.family.FredokaMedium,
    },
  });
