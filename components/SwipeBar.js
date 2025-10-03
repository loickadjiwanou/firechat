import React, { useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { useTheme } from "../hooks/useTheme";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.6;

export default function SwipeBar({ route, onComplete }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const { Colors, Fonts, Styles } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles);

  const textOpacity = translateX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD * 0.5],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === 5) {
      if (event.nativeEvent.translationX > SWIPE_THRESHOLD) {
        onComplete();
        setTimeout(async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push(`${route}`);
        }, 150);
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.swipeContainer}>
        <Animated.Text style={[styles.instruction, { opacity: textOpacity }]}>
          Swipe to Start
        </Animated.Text>
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View
            style={[styles.swipeButton, { transform: [{ translateX }] }]}
          >
            <Feather
              name="chevrons-right"
              size={Styles.size.xxxl}
              color={Colors.primaryBlue}
            />
          </Animated.View>
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
}

const createStyles = (Colors, Fonts, Styles) =>
  StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Colors.transparent,
    },
    swipeContainer: {
      width: width * 0.8,
      height: 70,
      borderRadius: 50,
      backgroundColor: Colors.primaryBlue,
      justifyContent: "center",
      paddingHorizontal: Styles.padding.xs,
      overflow: "hidden",
    },
    instruction: {
      position: "absolute",
      left: 75,
      color: Colors.background,
      fontSize: Fonts.sizes.md,
      fontFamily: Fonts.family.FredokaRegular,
    },
    swipeButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: Colors.background,
      justifyContent: "center",
      alignItems: "center",
    },
  });
