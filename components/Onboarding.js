import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../hooks/useTheme";
import Button from "./Button";
import * as Haptics from "expo-haptics";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const onboardingData = [
  {
    id: 1,
    title: "Chat Anywhere",
    description:
      "Stay connected with friends and colleagues instantly, no matter where you are in the world.",
    image: require("../assets/onboarding/onboarding1.png"),
  },
  {
    id: 2,
    title: "Share Moments",
    description:
      "Send photos, voice notes, and emojis to make your conversations more lively and personal.",
    image: require("../assets/onboarding/onboarding2.png"),
  },
  {
    id: 3,
    title: "Stay Notified",
    description:
      "Get real-time updates so you never miss an important message or group conversation.",
    image: require("../assets/onboarding/onboarding3.png"),
  },
  {
    id: 4,
    title: "Private & Secure",
    description:
      "Your chats are encrypted, giving you full privacy and peace of mind while messaging.",
    image: require("../assets/onboarding/onboarding4.png"),
  },
];

const Paginator = ({ itemsLength, activeIndex }) => {
  const SIZE = 10;
  const GAP = 4;

  const { Colors, Fonts, Styles, theme } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles);

  return (
    <View
      style={{ flexDirection: "row", columnGap: GAP, position: "relative" }}
    >
      {Array.from({ length: itemsLength }).map((_, index) => (
        <View key={index} style={[styles.dot]} />
      ))}
      <View style={[styles.activeDot, { left: activeIndex * (SIZE + GAP) }]} />
    </View>
  );
};

const BouncyOnboardingItem = ({ item, index, scrollX }) => {
  const { Colors, Fonts, Styles, theme } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles);

  return (
    <View style={[styles.itemContainer]}>
      <Text style={[styles.title]}>{item.title}</Text>
      <Text style={[styles.description]}>{item.description}</Text>
      <Image style={[styles.image]} source={item.image} />
    </View>
  );
};

const Onboarding = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const [buttonWidth, setButtonWidth] = useState(100);
  const [buttonLabel, setButtonLabel] = useState("Next");
  const [buttonLoading, setButtonLoading] = useState(false);

  const { Colors, Fonts, Styles, theme } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles);

  const handleScroll = (direction) => {
    const newIndex = activeIndex + (direction === "right" ? 1 : -1);
    if (newIndex >= 0 && newIndex < onboardingData.length) {
      setActiveIndex(newIndex);
      const newScrollX = SCREEN_WIDTH * newIndex;
      scrollViewRef.current.scrollTo({
        x: newScrollX,
        y: 0,
        animated: true,
      });
    }
  };

  const handleNextPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (activeIndex === onboardingData.length - 1) {
      setButtonLoading(true);
      setTimeout(() => {
        setButtonLoading(false);
        router.push("/setup");
      }, 1000);
    } else {
      handleScroll("right");
    }
  };

  const handleBackPress = () => {
    if (activeIndex === 0) {
      router.back();
    } else {
      handleScroll("left");
    }
  };

  const handleSkipPress = () => {
    setActiveIndex(onboardingData.length - 1);
    const newScrollX = SCREEN_WIDTH * (onboardingData.length - 1);
    scrollViewRef.current.scrollTo({
      x: newScrollX,
      y: 0,
      animated: false,
    });
  };

  useEffect(() => {
    if (activeIndex === onboardingData.length - 1) {
      setButtonWidth((SCREEN_WIDTH / 3) * 2);
      setButtonLabel("Login");
    } else {
      setButtonWidth(100);
      setButtonLabel("Next");
    }
  }, [activeIndex]);

  return (
    <View style={styles.view}>
      <View style={styles.header}>
        <Button
          onPress={handleBackPress}
          title="Back"
          variant="text"
          titleStyle={styles.headerButton}
        />
        {activeIndex === onboardingData.length - 1 ? (
          <View />
        ) : (
          <Button
            title="Skip"
            onPress={handleSkipPress}
            variant="text"
            titleStyle={styles.headerButton}
          />
        )}
      </View>
      <ScrollView
        ref={scrollViewRef}
        scrollEnabled={false}
        contentContainerStyle={{ alignItems: "center" }}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        horizontal
        style={styles.container}
      >
        {onboardingData.map((item, index) => (
          <BouncyOnboardingItem
            key={index}
            scrollX={activeIndex * SCREEN_WIDTH}
            index={index}
            item={item}
          />
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Paginator
          itemsLength={onboardingData.length}
          activeIndex={activeIndex}
        />
        <Pressable
          onPress={handleNextPress}
          style={[styles.buttonStyle, { width: buttonWidth }]}
        >
          {!buttonLoading ? (
            <Text style={styles.buttonLabel}>{buttonLabel}</Text>
          ) : (
            <ActivityIndicator size={"small"} color="white" />
          )}
        </Pressable>
      </View>
    </View>
  );
};

const createStyles = (Colors, Fonts, Styles) =>
  StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: Colors.background,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 50,
    },
    container: {
      flex: 1,
    },
    header: {
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
    },
    headerButton: {
      color: Colors.bw,
      fontSize: Fonts.sizes.xl,
      fontFamily: Fonts.family.FredokaRegular,
    },
    footer: {
      justifyContent: "center",
      rowGap: 20,
      flex: 0.4,
      paddingBottom: 20,
      alignItems: "center",
    },
    buttonStyle: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.primaryBlue,
      height: 40,
      borderRadius: Styles.borderRadius.xxl,
    },
    itemContainer: {
      width: SCREEN_WIDTH,
      alignItems: "center",
    },
    title: {
      fontSize: Fonts.sizes.xxxl,
      fontFamily: Fonts.family.FredokaMedium,
      marginBottom: 30,
      color: Colors.bw,
    },
    description: {
      fontSize: Fonts.sizes.lg,
      fontFamily: Fonts.family.FredokaRegular,
      width: "90%",
      textAlign: "center",
      marginBottom: 40,
      color: Colors.bw,
    },
    image: {
      width: "80%",
      height: SCREEN_HEIGHT / 4,
      resizeMode: "contain",
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: Styles.borderRadius.md,
      backgroundColor: Colors.gray2,
    },
    activeDot: {
      position: "absolute",
      backgroundColor: Colors.primaryBlue,
      width: 10,
      height: 10,
      borderRadius: Styles.borderRadius.md,
    },
    button: {
      height: 40,
      minWidth: 64,
      borderRadius: Styles.borderRadius.xs,
      paddingHorizontal: Styles.padding.lg,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    text: {
      fontSize: Fonts.sizes.sm,
      fontFamily: Fonts.family.FredokaRegular,
      color: Colors.bw,
      textAlign: "center",
    },
    withIconText: {
      flexDirection: "row",
      alignItems: "center",
    },
    fullWidth: {
      width: "100%",
    },
    buttonPressed: {
      opacity: 0.9,
    },
    buttonLabel: {
      color: Colors.white,
      fontSize: Fonts.sizes.lg,
      fontFamily: Fonts.family.FredokaRegular,
    },
    shadow: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
  });

export default Onboarding;
