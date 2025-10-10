import React, { useState } from "react";
import { View, Text, StyleSheet, Platform, TextInput } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { useToast } from "../hooks/useToast";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../configs/firebaseConfig";
import Button from "../components/Button";
import { StatusBar } from "expo-status-bar";
import { isValidEmail } from "../utils/validators";

export default function ForgotPassword() {
  const { Colors, Fonts, Styles } = useTheme();
  const { showToast, genericErrorToast, infoToast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const styles = createStyles(Colors, Fonts, Styles);

  const handleResetPassword = async () => {
    if (!email) {
      showToast({
        type: "error",
        message: "Missing Email",
        subMessage: "Please enter your email address.",
      });
      return;
    }

    if (!isValidEmail(email)) {
      showToast({
        type: "error",
        message: "Invalid Email",
        subMessage: "Please enter a valid email address.",
      });
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email, {
        url: "https://fir-chat-192da.firebaseapp.com",
        handleCodeInApp: true,
      });
      infoToast("Email Sent", "Check your inbox for the password reset link.");
      router.back();
    } catch (error) {
      console.log("Password reset error:", error);
      switch (error.code) {
        case "auth/user-not-found":
          showToast({
            type: "error",
            message: "User Not Found",
            subMessage: "No account found with this email.",
          });
          break;
        case "auth/invalid-email":
          showToast({
            type: "error",
            message: "Invalid Email",
            subMessage: "Please enter a valid email address.",
          });
          break;
        default:
          genericErrorToast("Password Reset Failed", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Your Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address to receive a password reset link.
      </Text>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={Colors.bw + "80"}
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <Button
          title="Send Reset Link"
          loading={loading}
          onPress={handleResetPassword}
          style={styles.button}
        />
        <Button
          title="Back to Login"
          onPress={() => router.back()}
          style={[styles.button, styles.backButton]}
        />
      </View>
    </View>
  );
}

const createStyles = (Colors, Fonts, Styles) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      paddingTop: Platform.OS === "android" ? 25 : 50,
      paddingHorizontal: Styles.padding.sm,
    },
    title: {
      color: Colors.bw,
      fontSize: Fonts.sizes.xl,
      fontFamily: Fonts.family.FredokaRegular,
      textAlign: "center",
      marginTop: Styles.margin.xl,
      marginBottom: Styles.margin.sm,
    },
    subtitle: {
      color: Colors.bw,
      opacity: Styles.opacity.xl,
      fontSize: Fonts.sizes.md,
      fontFamily: Fonts.family.FredokaRegular,
      textAlign: "center",
      marginBottom: Styles.margin.sm,
    },
    formContainer: {
      paddingHorizontal: Styles.padding.xs,
      paddingVertical: Styles.padding.xxxl,
      backgroundColor: Colors.background,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      color: Colors.bw,
      fontSize: Fonts.sizes.md,
      fontFamily: Fonts.family.FredokaRegular,
      marginBottom: Styles.margin.sm,
      opacity: Styles.opacity.xlg,
    },
    input: {
      backgroundColor: Colors.background,
      borderWidth: 1,
      borderColor: Colors.bw + "20",
      borderRadius: Styles.borderRadius.xxxl,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: Fonts.sizes.md,
      fontFamily: Fonts.family.FredokaRegular,
      color: Colors.bw,
      minHeight: 50,
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
    backButton: {
      backgroundColor: Colors.bw + "20",
    },
  });
