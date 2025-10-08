import React from "react";
import { View, Text, StyleSheet, Platform, ScrollView } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { IsTabBarActive } from "../../components/DynamicBottomTab";
import { StatusBar } from "expo-status-bar";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function ChatsScreen() {
  const { Colors, Styles, Fonts } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      IsTabBarActive.value = event.contentOffset.y <= 0;
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <AnimatedScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        overScrollMode="never"
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: Colors.background,
        }}
        style={{ flex: 1, backgroundColor: Colors.background }}
      >
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Chats content coming soon...
          </Text>
        </View>
      </AnimatedScrollView>
    </View>
  );
}

const createStyles = (Colors, Fonts, Styles) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      //   paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 50,
      paddingHorizontal: Styles.padding.sm,
    },
    placeholder: {
      flex: 1,
      height: 1000, // Ensure enough height to trigger scrolling
      justifyContent: "center",
      alignItems: "center",
    },
    placeholderText: {
      fontSize: 16,
      fontFamily: Fonts.FredokaMedium,
      color: Colors.gray,
      textAlign: "center",
    },
  });
