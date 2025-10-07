import React, { useEffect, useCallback, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Stack, useRouter } from "expo-router";
import ToastManager from "toastify-react-native";

import { useTheme } from "../hooks/useTheme";
import { useAuthListener } from "../hooks/useAuthListener";

SplashScreen.preventAutoHideAsync();

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
  const router = useRouter();
  const { user, authChecked } = useAuthListener();
  const hasRedirected = useRef(false);

  const [fontsLoaded, fontsError] = useFonts({
    FredokaMedium: require("../assets/fonts/FredokaMedium.ttf"),
    FredokaRegular: require("../assets/fonts/FredokaRegular.ttf"),
  });

  const onReady = useCallback(async () => {
    if ((fontsLoaded || fontsError) && authChecked) {
      await SplashScreen.hideAsync();

      if (!hasRedirected.current) {
        hasRedirected.current = true;

        if (user) {
          console.log("✅ User is logged in:", user.email);
          router.replace("/home");
        } else {
          console.log("🚪 User is not logged in");
          router.replace("/");
        }
      }
    }
  }, [fontsLoaded, fontsError, authChecked, user]);

  useEffect(() => {
    onReady();
  }, [onReady]);

  if (!fontsLoaded && !fontsError) return null;
  if (!authChecked) return null;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="setup" />
        <Stack.Screen name="forgotpassword" />
        <Stack.Screen name="permissions" />
        <Stack.Screen name="home" />
      </Stack>

      <ToastManager
        position="bottom"
        duration={4000}
        showCloseIcon
        showProgressBar
        iconFamily="Ionicons"
        iconSize={24}
        closeIcon="close"
        closeIconFamily="Ionicons"
        closeIconSize={20}
        closeIconColor="#fff"
        useModal={false}
      />
      <ThemedStatusBar />
    </>
  );
}
