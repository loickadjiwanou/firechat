import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../../hooks/useTheme";

export default function CallsScreen() {
  const { Colors, Styles, Fonts } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles);

  const generateDummyData = () => {
    return Array(100)
      .fill(null)
      .map((_, index) => ({
        id: index,
        title: `Item ${index + 1}`,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      }));
  };

  return (
    <View style={styles.view}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        style={styles.container}
      >
        <Text>Groups</Text>
        {generateDummyData().map((item) => (
          <View
            key={item.id}
            style={[
              styles.card,
              {
                backgroundColor: item.color,
              },
            ]}
          >
            <Text style={[styles.cardText, { color: Colors.bw }]}>
              {item.title}
            </Text>
          </View>
        ))}
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

const createStyles = (Colors, Fonts, Styles) =>
  StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: Colors.userBarBackground,
      paddingTop: 75,
    },
    container: {
      backgroundColor: Colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: Styles.padding.sm,
      paddingVertical: 10,
    },
    footer: {
      paddingBottom: 180,
    },
    card: {
      borderRadius: 10,
      marginVertical: 10,
      justifyContent: "center",
      alignItems: "center",
      height: 100,
    },
    cardText: {
      fontSize: Fonts.sizes.md,
      fontFamily: Fonts.family.FredokaMedium,
      textAlign: "center",
    },
  });
