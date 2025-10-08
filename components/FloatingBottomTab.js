import React, { useCallback, useMemo } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import {
  useWindowDimensions,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Canvas,
  LinearGradient,
  Path,
  RoundedRect,
  Skia,
} from "@shopify/react-native-skia";
import { useRouter, usePathname } from "expo-router";
import { useTheme } from "../hooks/useTheme";

const ScreenNames = {
  Chats: "chats",
  Groups: "groups",
  Calls: "calls",
  Settings: "settings",
};

const FloatingBottomTab = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { bottom } = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { Colors, Fonts, Styles, theme } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles);

  const tabBarWidth = screenWidth * 0.95;
  const singleTabWidth = (tabBarWidth - 0.1 * tabBarWidth) / 4;

  // Map routes to indices for animation
  const routes = Object.values(ScreenNames);
  const currentIndex =
    routes.indexOf(pathname.replace("/", "")) >= 0
      ? routes.indexOf(pathname.replace("/", ""))
      : 0;

  const selectedAnimatedIndex = useDerivedValue(() => {
    return withTiming(currentIndex);
  }, [currentIndex]);

  const rShaderLightStyle = useAnimatedStyle(() => {
    const translateX = selectedAnimatedIndex.value * singleTabWidth;
    return {
      transform: [{ translateX: translateX }],
    };
  }, [singleTabWidth]);

  const getIconByScreenName = useCallback((screenName) => {
    switch (screenName) {
      case ScreenNames.Chats:
        return <Feather name="message-circle" size={24} color="white" />;
      case ScreenNames.Groups:
        return <Ionicons name="people-outline" size={26} color="white" />;
      case ScreenNames.Calls:
        return <Feather name="phone" size={24} color="white" />;
      case ScreenNames.Settings:
        return <Ionicons name="settings-sharp" size={24} color="white" />;
      default:
        return null;
    }
  }, []);

  const AnimatedOpacityView = ({ index, activeIndex, children, onPress }) => {
    const rStyle = useAnimatedStyle(() => {
      const opacity = withTiming(activeIndex.value === index ? 1 : 0.5);
      return { opacity };
    }, [index]);

    return (
      <Animated.View style={[styles.iconContainer, rStyle]}>
        <TouchableOpacity onPress={onPress} style={styles.iconButton}>
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const ShaderLight = ({ width, height }) => {
    const internalCanvasHorizontalPadding = 5;
    const canvasWidth = width - internalCanvasHorizontalPadding * 2;

    const path = useMemo(() => {
      const skPath = Skia.Path.Make();
      skPath.moveTo(internalCanvasHorizontalPadding * 3, 0);
      skPath.lineTo(width - internalCanvasHorizontalPadding * 3, 0);
      skPath.lineTo(width, height);
      skPath.lineTo(0, height);
      skPath.close();
      return skPath;
    }, [height, width]);

    return (
      <Canvas style={{ width, height }}>
        <Path path={path} color="white" opacity={0.5}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: height }}
            colors={["white", "transparent"]}
          />
        </Path>
        <RoundedRect
          x={internalCanvasHorizontalPadding}
          y={0}
          width={canvasWidth}
          height={7}
          color="white"
          r={20}
        />
      </Canvas>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: tabBarWidth,
          bottom: bottom,
        },
      ]}
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            left: 0.05 * tabBarWidth,
            zIndex: 10,
            height: 65,
            width: singleTabWidth,
          },
          rShaderLightStyle,
        ]}
      >
        <ShaderLight height={65} width={singleTabWidth} />
      </Animated.View>
      {Object.values(ScreenNames).map((screenName, index) => (
        <AnimatedOpacityView
          key={index}
          index={index}
          activeIndex={selectedAnimatedIndex}
          onPress={() => router.push(`/${screenName}`)}
        >
          {getIconByScreenName(screenName)}
        </AnimatedOpacityView>
      ))}
    </View>
  );
};

const createStyles = (Colors, Fonts, Styles) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.floatingBottomTabBg,
      height: 65,
      alignSelf: "center",
      borderRadius: 20,
      position: "absolute",
      paddingHorizontal: "5%",
      flexDirection: "row",
    },
    iconContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    iconButton: {
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
    },
  });

export default FloatingBottomTab;
