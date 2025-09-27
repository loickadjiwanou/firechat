import React from "react";
import { View, Text, StyleSheet, Platform, ScrollView } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import FluidTabInteraction from "../components/FluidTabInteraction";

export default function Setup() {
  const route = useRouter();
  const { Colors, Fonts, Styles, theme } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles);

  const tabs = [
    {
      id: "login",
      name: "Login",
      icon: "login",
      content: renderLogin(),
    },
    {
      id: "register",
      name: "Register",
      icon: "account",
      content: renderRegister(),
    },
  ];

  function renderLogin() {
    return (
      <View>
        <Text>login</Text>
      </View>
    );
  }

  function renderRegister() {
    return (
      <View>
        <Text>register</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.view}
      overScrollMode="never"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Get Started and Connect{"\n"}Instantly</Text>
      <Text style={styles.description}>Sign in to your Account</Text>

      <FluidTabInteraction
        tabs={tabs}
        defaultTabId="login"
        width={375}
        height={50}
        onTabChange={(tab) => console.log(`Onglet : ${tab.name}`)}
        contentStyle={{ backgroundColor: Colors.background }}
      />
    </ScrollView>
  );
}

const createStyles = (Colors, Fonts, Styles) =>
  StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: Colors.background,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 50,
      paddingHorizontal: Styles.padding.sm,
    },
    title: {
      color: Colors.bw,
      fontSize: Fonts.sizes.xl,
      fontFamily: Fonts.family.FredokaRegular,
      textAlign: "center",
      marginTop: 20,
    },
    description: {
      color: Colors.bw,
      opacity: 0.5,
      fontSize: Fonts.sizes.md,
      fontFamily: Fonts.family.FredokaRegular,
      textAlign: "center",
      marginTop: 10,
      marginBottom: 25,
    },
  });
