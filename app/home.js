import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../configs/firebaseConfig";
import { useRouter } from "expo-router";
import { useTheme } from "../hooks/useTheme";
import { useToast } from "../hooks/useToast";
import Button from "../components/Button";
import { StatusBar } from "expo-status-bar";

export default function Home() {
  const router = useRouter();
  const { Colors, Fonts, Styles } = useTheme();
  const { infoToast } = useToast();
  const [userName, setUserName] = useState("");
  const styles = createStyles(Colors, Fonts, Styles);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      infoToast("Signed Out", "You have been logged out successfully.");
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
      infoToast("Error", "Failed to sign out. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {userName || "User"}!</Text>
      <Text style={styles.subtitle}>You're now connected to your account.</Text>
      <Button title="Sign Out" onPress={handleSignOut} style={styles.button} />
    </View>
  );
}

const createStyles = (Colors, Fonts, Styles) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 50,
      paddingHorizontal: Styles.padding.sm,
    },
    title: {
      color: Colors.bw,
      fontSize: Fonts.sizes.xl,
      fontFamily: Fonts.family.FredokaRegular,
      textAlign: "center",
      marginBottom: Styles.margin.sm,
    },
    subtitle: {
      color: Colors.bw,
      opacity: Styles.opacity.xl,
      fontSize: Fonts.sizes.md,
      fontFamily: Fonts.family.FredokaRegular,
      textAlign: "center",
      marginBottom: Styles.margin.xxl,
    },
    button: {
      backgroundColor: Colors.primaryBlue,
      borderRadius: Styles.borderRadius.xxxl,
      height: Styles.size.xlg,
      paddingHorizontal: 32,
      alignItems: "center",
      marginTop: Styles.margin.xl,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
    },
  });
