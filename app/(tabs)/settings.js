import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../configs/firebaseConfig";
import { router } from "expo-router";
import { useTheme } from "../../hooks/useTheme";
import { useToast } from "../../hooks/useToast";
import Button from "../../components/Button";
import { useAuthListener } from "../../hooks/useAuthListener";

export default function SettingsScreen() {
  const { Colors, Fonts, Styles } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles);
  const { infoToast } = useToast();

  const { user } = useAuthListener();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      infoToast("Signed Out", "You have been logged out successfully.");
      router.push("/");
    } catch (error) {
      console.log("Sign out error:", error);
      infoToast("Error", "Failed to sign out. Please try again.");
    }
  };

  return (
    <View style={styles.view}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        style={styles.container}
      >
        <Text>Settings</Text>

        <Text style={styles.title}>
          Welcome, {user?.displayName || "User"}!
        </Text>
        <Text style={styles.subtitle}>
          You're now connected to your account.
        </Text>
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          style={styles.button}
        />
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
