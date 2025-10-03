import React, { useMemo, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useTheme } from "../hooks/useTheme";
import * as Haptics from "expo-haptics";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

const TimingConfig = {
  duration: 1000,
  easing: Easing.bezier(0.4, 0.0, 0.2, 1),
};

const SegmentedControl = ({ data, onPress, selected, width, height }) => {
  const internalPadding = 1;
  const cellBackgroundWidth = width / data.length;

  const { Colors, Fonts, Styles } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles);

  const Palette = {
    baseGray05: Colors.baseGray05,
    baseGray80: Colors.baseGray80,
    background: Colors.primaryBlue,
    highlightLabel: Colors.white,
    baseLabel: Colors.baseLabel,
  };

  const selectedCellIndex = useMemo(
    () => data.findIndex((item) => item.id === selected.id),
    [data, selected]
  );

  const rCellMessageStyle = useAnimatedStyle(() => {
    const padding = interpolate(
      selectedCellIndex,
      [0, data.length - 1],
      [internalPadding, -internalPadding]
    );

    return {
      left: withTiming(
        cellBackgroundWidth * selectedCellIndex + padding,
        TimingConfig
      ),
    };
  }, [selectedCellIndex]);

  return (
    <View
      style={[
        {
          backgroundColor: Palette.baseGray05,
          width,
          height,
          padding: internalPadding,
          flexDirection: "row",
          borderRadius: 30,
        },
      ]}
    >
      <Animated.View
        style={[
          {
            width: cellBackgroundWidth - internalPadding / data.length,
            height: height - internalPadding * 2,
            zIndex: 1,
            alignSelf: "center",
            position: "absolute",
            backgroundColor: Palette.background,
            borderRadius: 30,
            shadowOpacity: 0.15,
            shadowOffset: { height: 2, width: 0 },
            shadowRadius: 4,
            shadowColor: "#000",
            elevation: 3,
          },
          rCellMessageStyle,
        ]}
      />

      {data.map((item, index) => {
        const rLabelStyle = useAnimatedStyle(() => {
          return {
            color: withTiming(
              selectedCellIndex === index
                ? Palette.highlightLabel
                : Palette.baseLabel,
              TimingConfig
            ),
            fontFamily: Fonts.family.FredokaMedium,
            fontSize: Fonts.sizes.lg,
          };
        }, [selectedCellIndex, index]);

        return (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              {
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
                flexDirection: "row",
                gap: 5,
              },
              pressed && { transform: [{ scale: 0.95 }] },
            ]}
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onPress(item);
            }}
          >
            <AnimatedIcon name={item.icon} size={18} style={rLabelStyle} />
            <Animated.Text style={[styles.text, rLabelStyle]}>
              {item.name}
            </Animated.Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const FluidTabInteraction = ({
  tabs = [],
  defaultTabId = null,
  width = null,
  height = 50,
  onTabChange = null,
  contentStyle = {},
  containerStyle = {},
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const tabWidth = width || screenWidth - 40;

  const { Colors, Fonts, Styles } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles);

  const [selectedTab, setSelectedTab] = useState(() => {
    if (tabs.length === 0) return null;

    const defaultTab = defaultTabId
      ? tabs.find((tab) => tab.id === defaultTabId)
      : tabs[0];
    return defaultTab || tabs[0];
  });

  const handleTabPress = (tab) => {
    setSelectedTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  if (tabs.length === 0 || !selectedTab) {
    return null;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <SegmentedControl
        data={tabs}
        onPress={handleTabPress}
        selected={selectedTab}
        width={tabWidth}
        height={height}
      />

      <View style={[styles.contentContainer, contentStyle]}>
        {selectedTab.content}
      </View>
    </View>
  );
};

const createStyles = (Colors, Fonts, Styles) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      flex: 1,
      marginTop: 0,
    },
    text: {
      fontSize: Fonts.sizes.md,
      fontFamily: Fonts.family.FredokaRegular,
      color: Colors.bw,
      textAlign: "center",
    },
  });

export default FluidTabInteraction;
