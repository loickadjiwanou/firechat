import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { useTheme } from "../hooks/useTheme";

const ThemedStatusBar = () => {
  const { theme } = useTheme();
  return (
    <StatusBar
      style={theme === "dark" ? "light" : "dark"}
      backgroundColor="transparent"
      translucent
    />
  );
};

export default function RootLayout() {
  const [loaded] = useFonts({
    FredokaMedium: require("../assets/fonts/FredokaMedium.ttf"),
    FredokaRegular: require("../assets/fonts/FredokaRegular.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn("SplashScreen preventAutoHideAsync error:", e);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch((e) => {
        console.warn("SplashScreen hideAsync error:", e);
      });
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="setup" options={{ headerShown: false }} />
      </Stack>
      <ThemedStatusBar />
    </>
  );
}
