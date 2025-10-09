import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";

export default function NullUserProfilePhoto({ from }) {
  const { Colors, Fonts, Styles } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles, from);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>?</Text>
    </View>
  );
}

const createStyles = (Colors, Fonts, Styles, from) =>
  StyleSheet.create({
    container: {
      width: from == "UserBar" ? 60 : from == "UserChatBar" ? 40 : 50,
      height: from == "UserBar" ? 60 : from == "UserChatBar" ? 40 : 50,
      borderRadius: 50,
      backgroundColor: Colors.gray,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      color: Colors.bw,
      fontSize: Fonts.sizes.xxl,
      fontFamily: Fonts.family.FredokaRegular,
    },
  });
