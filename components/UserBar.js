import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Entypo, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthListener } from "../hooks/useAuthListener";
import NullUserProfilePhoto from "./NullUserProfilePhoto";

export default function UserBar({
  path,
  pathData,
  backgroundColor,
  backArrow,
  searchIcon,
  moreIcon,
  onPressSearch,
  onPressMore,
  barStyles,
}) {
  const { Colors, Fonts, Styles, theme } = useTheme();
  const styles = createStyles(
    Colors,
    Fonts,
    Styles,
    backgroundColor,
    barStyles
  );

  const { user } = useAuthListener();

  const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  return (
    <View style={styles.view}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {backArrow && (
            <TouchableOpacity
              activeOpacity={0.5}
              hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              onPress={() => router.back()}
              style={styles.arrow}
            >
              <Entypo
                name="chevron-left"
                size={Styles.size.xxl}
                color={Colors.bw}
              />
            </TouchableOpacity>
          )}

          <View style={styles.bloc}>
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={styles.profilepic}
              />
            ) : (
              <NullUserProfilePhoto from={"UserBar"} />
            )}

            <View style={styles.textBloc}>
              <Text numberOfLines={1} style={styles.name}>
                {user?.displayName}
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
              <Octicons
                name="search"
                size={Styles.size.xxl}
                color={Colors.bw}
              />
            </TouchableOpacity>
          )}

          {moreIcon && (
            <TouchableOpacity
              activeOpacity={0.5}
              hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              onPress={() => onPressMore}
              style={styles.moreIcon}
            >
              <Entypo
                name="dots-three-vertical"
                size={Styles.size.xxl}
                color={Colors.bw}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.path}>
        <Text style={styles.pathText}>{capitalizeFirstLetter(path)}</Text>
        {pathData?.nb > 0 && (
          <View style={styles.pathValue}>
            <Text style={styles.pathTextValue}>{pathData?.nb}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const createStyles = (Colors, Fonts, Styles, backgroundColor, barStyles) =>
  StyleSheet.create({
    view: {
      ...barStyles,
      backgroundColor: backgroundColor || Colors.lightgray,
    },
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    arrow: {
      marginRight: 10,
    },
    profilepic: {
      width: 60,
      height: 60,
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
    path: {
      flexDirection: "row",
      gap: 6,
      alignItems: "center",
    },
    pathText: {
      color: Colors.bw,
      fontSize: Fonts.sizes.xxg,
      fontFamily: Fonts.family.FredokaMedium,
    },
    pathValue: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.tileBgColor,
      borderRadius: Styles.borderRadius.xxxl,
      width: 24,
      height: 24,
      top: 2,
    },
    pathTextValue: {
      color: Colors.bw,
      fontSize: Fonts.sizes.md,
      fontFamily: Fonts.family.FredokaRegular,
    },
  });
