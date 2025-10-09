import React, { useEffect, useCallback, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Stack, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
    if ((fontsLoaded || fontsError) && authChecked && !hasRedirected.current) {
      await SplashScreen.hideAsync();
      hasRedirected.current = true;

      if (user) {
        console.log("✅ User is logged in:", user.email);
        router.replace("(tabs)/chats");
      } else {
        console.log("🚪 User is not logged in");
        router.replace("/");
      }
    }
  }, [fontsLoaded, fontsError, authChecked, user, router]);

  useEffect(() => {
    onReady();
  }, [onReady]);

  if (!fontsLoaded && !fontsError) return null;
  if (!authChecked) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{ gestureEnabled: false, headerBackVisible: false }}
        />
        <Stack.Screen
          name="onboarding"
          options={{ gestureEnabled: false, headerBackVisible: false }}
        />
        <Stack.Screen
          name="setup"
          options={{ gestureEnabled: false, headerBackVisible: false }}
        />
        <Stack.Screen
          name="forgotpassword"
          options={{ gestureEnabled: false, headerBackVisible: false }}
        />
        <Stack.Screen
          name="permissions"
          options={{ gestureEnabled: true, headerBackVisible: true }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{ gestureEnabled: false, headerBackVisible: false }}
        />
        <Stack.Screen name="contacts" options={{ presentation: "modal" }} />
        <Stack.Screen
          name="contacts-groups"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="chat-room/[id]"
          options={{
            gestureEnabled: true,
            headerBackVisible: true,
          }}
        />
      </Stack>

      <ToastManager
        position="bottom"
        duration={3000}
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
    </GestureHandlerRootView>
  );
}
