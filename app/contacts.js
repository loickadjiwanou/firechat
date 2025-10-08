import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";

export default function ContactsScreen() {
  const { Colors, Fonts, Styles, theme } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles);

  return (
    <View style={styles.view}>
      <Text>Contacts</Text>
    </View>
  );
}
const createStyles = (Colors, Fonts, Styles) =>
  StyleSheet.create({
    view: {
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 15,
    },
  });
