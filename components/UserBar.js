import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Entypo, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import profilepic from "../assets/images/profilepic.png";

export default function UserBar({
  backgroundColor,
  backArrow,
  searchIcon,
  moreIcon,
  onPressSearch,
  onPressMore,
}) {
  const { Colors, Fonts, Styles, theme } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles, backgroundColor);

  return (
    <View style={styles.view}>
      <View style={styles.leftSection}>
        {backArrow && (
          <TouchableOpacity
            activeOpacity={0.5}
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
            onPress={() => router.back()}
            style={styles.arrow}
          >
            <Entypo name="chevron-left" size={26} color={Colors.bw} />
          </TouchableOpacity>
        )}

        <View style={styles.bloc}>
          <Image source={profilepic} style={styles.profilepic} />
          <View style={styles.textBloc}>
            <Text numberOfLines={1} style={styles.name}>
              John Doe
            </Text>
            <Text style={styles.status}>💼{"  "}At work</Text>
          </View>
        </View>
      </View>

      <View style={styles.rightSection}>
        {searchIcon && (
          <TouchableOpacity
            activeOpacity={0.5}
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
            onPress={() => onPressSearch}
            style={styles.searchIcon}
          >
            <Octicons name="search" size={26} color={Colors.bw} />
          </TouchableOpacity>
        )}

        {moreIcon && (
          <TouchableOpacity
            activeOpacity={0.5}
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
            onPress={() => onPressMore}
            style={styles.moreIcon}
          >
            <Entypo name="dots-three-vertical" size={26} color={Colors.bw} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const createStyles = (Colors, Fonts, Styles, backgroundColor) =>
  StyleSheet.create({
    view: {
      backgroundColor: backgroundColor || Colors.lightgray,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    arrow: {
      marginRight: 10,
    },
    profilepic: {
      width: 75,
      height: 75,
      borderRadius: 50,
    },
    bloc: {
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
    },
    textBloc: {
      paddingVertical: 5,
      flexDirection: "column",
      gap: 5,
    },
    name: {
      color: Colors.bw,
      fontSize: Fonts.sizes.xl,
      fontFamily: Fonts.family.FredokaMedium,
      width: 130,
    },
    status: {
      color: Colors.bw,
      fontSize: Fonts.sizes.md,
      fontFamily: Fonts.family.FredokaRegular,
    },
    searchIcon: {
      //
    },
    moreIcon: {
      //
    },
    leftSection: {
      flexDirection: "row",
      alignItems: "center",
    },
    rightSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: 25,
    },
  });
