import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Stack, useRouter } from "expo-router";
import { useTheme } from "../hooks/useTheme";
import ToastManager from "toastify-react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../configs/firebaseConfig";

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
  const [loaded, error] = useFonts({
    FredokaMedium: require("../assets/fonts/FredokaMedium.ttf"),
    FredokaRegular: require("../assets/fonts/FredokaRegular.ttf"),
  });
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthChecked(true);
      if (user) {
        // console.log("User is logged in:", user.email);
        router.replace("/home");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if ((loaded || error) && authChecked) {
      SplashScreen.hideAsync().catch((e) => {
        console.warn("SplashScreen hideAsync error:", e);
      });
    }
  }, [loaded, error, authChecked]);

  if (!loaded && !error && !authChecked) return null;

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="setup" options={{ headerShown: false }} />
        <Stack.Screen name="forgotpassword" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
      </Stack>
      <ToastManager
        position="bottom"
        duration={4000}
        showCloseIcon={true}
        showProgressBar={true}
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
