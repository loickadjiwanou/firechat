import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import { IsTabBarActive } from "../../components/DynamicBottomTab";

const generateDummyData = () => {
  return Array(100)
    .fill(null)
    .map((_, index) => ({
      id: index,
      title: `Item ${index + 1}`,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    }));
};

export default function ChatsScreen() {
  const { Colors } = useTheme();
  const { top: safeTop } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const data = generateDummyData();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      IsTabBarActive.value = event.contentOffset.y <= 0;
    },
  });

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: item.color,
          width: (width - 24 * 3) / 2,
        },
      ]}
    >
      <Text style={[styles.cardText, { color: Colors.bw }]}>{item.title}</Text>
    </View>
  );

  return (
    <Animated.FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      contentContainerStyle={{
        padding: 12,
        paddingTop: safeTop + 12,
        backgroundColor: Colors.background,
      }}
      style={{ flex: 1, backgroundColor: Colors.background }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 12,
    padding: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    height: 120,
  },
  cardText: {
    fontSize: 16,
    fontFamily: "FredokaMedium",
    textAlign: "center",
  },
});
