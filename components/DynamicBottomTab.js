import React, { useCallback } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { makeMutable } from "react-native-reanimated";
import { Colors, useTheme } from "../hooks/useTheme";
import { useRouter, usePathname } from "expo-router";

// Constants
const BOTTOM_BAR_HEIGHT = 60;
const LINEAR_GRADIENT_HEIGHT = 100;
const LINEAR_GRADIENT_COLORS = [
  "rgba(255,255,255,0)",
  "rgba(0,0,0,0.1)",
  "rgba(0,0,0,0.3)",
  "rgba(0,0,0,0.6)",
];
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
const IS_SMALL_DEVICE = SCREEN_HEIGHT < 700;

const ScreenNamesArray = ["chats", "groups", "calls", "settings"];

// State
export const IsTabBarActive = makeMutable(true);

// PressableScale Component
const PressableScale = ({ children, onPress, style }) => {
  const active = useSharedValue(false);

  const gesture = Gesture.Tap()
    .maxDuration(4000)
    .onTouchesDown(() => {
      active.value = true;
    })
    .onTouchesUp(() => {
      if (onPress) runOnJS(onPress)();
    })
    .onFinalize(() => {
      active.value = false;
    });

  const rAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(active.value ? 0.92 : 1) }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[style, rAnimatedStyle]}>{children}</Animated.View>
    </GestureDetector>
  );
};

// TabBarItem Component
const TabBarItem = React.memo(({ onPress, screenName, focused }) => {
  const { Colors } = useTheme();

  const iconStyle = useAnimatedStyle(() => ({
    marginTop: interpolate(IsTabBarActive.value ? 1 : 0, [0, 1], [0, 25]),
  }));

  const getIconByScreenName = useCallback(
    (pageName) => {
      const icons = {
        chats: { name: "chatbox-ellipses-outline", size: 30 },
        groups: { name: "grid-outline", size: 24 },
        calls: { name: "call-outline", size: 25 },
        settings: { name: "settings-outline", size: 25 },
      };

      const icon = icons[pageName];
      if (!icon) return null;

      return (
        <Animated.View style={iconStyle}>
          <Ionicons
            {...icon}
            color={focused ? Colors.primaryBlue : Colors.gray + "80"}
          />
        </Animated.View>
      );
    },
    [Colors.primaryBlue, Colors.gray, focused]
  );

  return (
    <View style={styles.fill}>
      <PressableScale style={styles.fillCenter} onPress={onPress}>
        {getIconByScreenName(screenName)}
      </PressableScale>
    </View>
  );
});

// BottomTabBar Component
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const BottomTabBar = ({ state }) => {
  const { Colors } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const onTapIcon = useCallback(
    (screenName) => {
      router.push(`(tabs)/${screenName}`);
    },
    [router]
  );

  // Determine the active tab index based on the current pathname
  const currentTab = ScreenNamesArray.findIndex(
    (name) => pathname === `(tabs)/${name}` || pathname === `/${name}`
  );

  const { bottom: safeBottom } = useSafeAreaInsets();
  const bottomBarSafeHeight =
    BOTTOM_BAR_HEIGHT + safeBottom + 15 + LINEAR_GRADIENT_HEIGHT;

  const progress = useDerivedValue(() =>
    withSpring(IsTabBarActive.value ? 1 : 0)
  );
  const paddingBottom = useDerivedValue(() =>
    interpolate(progress.value, [0, 1], [safeBottom + 15, 0])
  );

  const rBarStyle = useAnimatedStyle(() => {
    const leftRight = interpolate(
      progress.value,
      [0, 1],
      [0.15 * SCREEN_WIDTH, 0]
    );
    const height = interpolate(
      progress.value,
      [0, 1],
      [BOTTOM_BAR_HEIGHT, BOTTOM_BAR_HEIGHT + safeBottom + 15]
    );
    const borderRadius = interpolate(
      progress.value,
      [0, 1],
      [0.15 * SCREEN_WIDTH, 20]
    );
    const borderWidth = interpolate(progress.value, [0, 0.2], [0.2, 0.2]);

    return {
      left: leftRight,
      right: leftRight,
      bottom: paddingBottom.value - 2,
      height,
      borderRadius,
      borderWidth,
    };
  });

  const rBottomViewStyle = useAnimatedStyle(() => ({
    height: interpolate(progress.value, [0, 1], [0, safeBottom + 15]),
  }));

  const rBlurStyle = useAnimatedStyle(() => ({
    paddingHorizontal: interpolate(progress.value, [0, 1], [0, 15]),
  }));

  return (
    <>
      <LinearGradient
        pointerEvents="none"
        colors={LINEAR_GRADIENT_COLORS}
        style={[{ height: bottomBarSafeHeight }, styles.gradientContainer]}
      />
      <Animated.View style={[styles.bottomContainer, rBarStyle]}>
        <AnimatedBlurView
          tint="systemMaterialDark"
          intensity={90}
          style={[
            styles.blurViewStyle,
            Platform.select({
              android: [
                styles.androidBlurView,
                { backgroundColor: Colors.background + "CC" },
              ],
            }),
            rBlurStyle,
          ]}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.container}>
              {ScreenNamesArray.map((key, index) => (
                <TabBarItem
                  key={key}
                  screenName={key}
                  focused={currentTab === index}
                  onPress={() => onTapIcon(key)}
                />
              ))}
            </View>
            <Animated.View style={rBottomViewStyle} />
          </View>
        </AnimatedBlurView>
      </Animated.View>
    </>
  );
};

// DynamicBottomTab Component
const DynamicBottomTab = (props) => {
  return <BottomTabBar {...props} />;
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
  },
  gradientContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomContainer: {
    borderCurve: "continuous",
    overflow: "hidden",
    borderColor: Colors.bw + "40",
    position: "absolute",
  },
  blurViewStyle: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  androidBlurView: {
    backgroundColor: "#D3D3D3",
  },
  fill: {
    flex: 1,
  },
  fillCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DynamicBottomTab;
