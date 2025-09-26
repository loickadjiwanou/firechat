import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, useTheme } from "../hooks/useTheme";
import { useRouter } from "expo-router";

export default function Login() {
  const route = useRouter();
  const { Colors, Fonts, Styles, theme } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles);

  return (
    <View style={styles.view}>
      <Text style={styles.text}>Login Screen</Text>
    </View>
  );
}

const createStyles = (Colors, Fonts, Styles) =>
  StyleSheet.create({
    view: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Colors.background,
    },
    text: {
      color: Colors.bw,
      fontSize: Fonts.sizes.xl,
      fontFamily: Fonts.family.FredokaRegular,
    },
  });
