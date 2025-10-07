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
import { Ionicons, Lucide } from "@expo/vector-icons";
import { makeMutable } from "react-native-reanimated";
import { useTheme } from "../hooks/useTheme";

// Constants
const BOTTOM_BAR_HEIGHT = 70;
const LINEAR_GRADIENT_HEIGHT = 100;
const LINEAR_GRADIENT_COLORS = [
  "rgba(255,255,255,0)",
  "rgba(0,0,0,0.1)",
  "rgba(0,0,0,0.5)",
  "rgba(0,0,0,0.8)",
];
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
const IS_SMALL_DEVICE = SCREEN_HEIGHT < 700;

const ScreenNamesArray = ["chats", "groups", "calls", "settings"];
const ScreenNames = ScreenNamesArray.reduce((acc, name) => {
  acc[name] = name;
  return acc;
}, {});

const screensMap = Object.keys(ScreenNames).reduce(
  (acc, key, index) => ({
    ...acc,
    [index]: key,
  }),
  {}
);

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
const TabBarItem = React.memo(
  ({ onPress, focusedIndex, index, screenName }) => {
    const { Colors } = useTheme();
    const isFocused = useDerivedValue(() => focusedIndex.value === index);

    const rStyle = useAnimatedStyle(() => ({
      opacity: withTiming(isFocused.value ? 1 : 0.3),
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
          <Ionicons
            {...icon}
            color={isFocused.value ? Colors.primaryBlue : Colors.bw + "80"}
          />
        );
      },
      [Colors.primaryBlue, Colors.bw]
    );

    return (
      <Animated.View style={[styles.fill, rStyle]}>
        <PressableScale style={styles.fillCenter} onPress={onPress}>
          {getIconByScreenName(screenName)}
        </PressableScale>
      </Animated.View>
    );
  }
);

// BottomTabBar Component
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const BottomTabBar = ({ state, navigation }) => {
  const { Colors } = useTheme();
  const focusedIndex = useSharedValue(state.index);
  const currentIndex = state.index;

  const onTapIcon = useCallback(
    (selectedIndex) => {
      const nextScreen = screensMap[selectedIndex];
      const isChangingRoute = currentIndex !== selectedIndex;
      const popsAmount = navigation
        .getState()
        .routes.find((item) => item.name === nextScreen)?.state?.index;

      if (!isChangingRoute && popsAmount !== 0 && popsAmount) {
        navigation.dispatch({ type: "POP", count: popsAmount });
        return;
      }

      navigation.navigate(nextScreen);
    },
    [currentIndex, navigation]
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
    const borderWidth = interpolate(progress.value, [0, 1], [1, 0.6]);

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
          intensity={70}
          style={[
            styles.blurViewStyle,
            Platform.select({
              android: [
                styles.androidBlurView,
                { backgroundColor: Colors.background },
              ],
            }),
            rBlurStyle,
          ]}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.container}>
              {Object.keys(ScreenNames).map((key, index) => (
                <TabBarItem
                  key={key}
                  screenName={key}
                  focusedIndex={focusedIndex}
                  index={index}
                  onPress={() => {
                    onTapIcon(index);
                    focusedIndex.value = index;
                  }}
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
    borderColor: "rgba(216, 216, 216, 0.597)",
    position: "absolute",
  },
  blurViewStyle: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  androidBlurView: {
    backgroundColor: "#959595",
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
