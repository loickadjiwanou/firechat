import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { useTheme } from "../hooks/useTheme";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import FluidTabInteraction from "../components/FluidTabInteraction";
import Button from "../components/Button";
import { isValidEmail } from "../utils/validators";
import { Feather } from "@expo/vector-icons";

const LoginForm = React.memo(({ onSubmit }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const { Colors, Fonts, Styles } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles);

  return (
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor={Colors.bw + "80"}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
          }}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor={Colors.bw + "80"}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
          }}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Feather
          name={!showPassword ? "eye" : "eye-off"}
          size={24}
          color={Colors.bw + "80"}
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        />
      </View>

      <Button
        title={"Login"}
        loading={false}
        onPress={() => onSubmit({ email, password })}
        style={styles.button}
      />
    </View>
  );
});

const RegisterForm = React.memo(({ onSubmit }) => {
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordC, setShowPasswordC] = React.useState(false);
  const { Colors, Fonts, Styles } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles);

  return (
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor={Colors.bw + "80"}
          value={fullName}
          onChangeText={(text) => {
            setFullName(text);
          }}
          autoCapitalize="words"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor={Colors.bw + "80"}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Create a password"
          placeholderTextColor={Colors.bw + "80"}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
          }}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Feather
          name={!showPassword ? "eye" : "eye-off"}
          size={24}
          color={Colors.bw + "80"}
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          placeholderTextColor={Colors.bw + "80"}
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
          }}
          secureTextEntry={!showPasswordC}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Feather
          name={!showPasswordC ? "eye" : "eye-off"}
          size={24}
          color={Colors.bw + "80"}
          onPress={() => setShowPasswordC(!showPasswordC)}
          style={styles.eyeIcon}
        />
      </View>

      <Button
        title={"Create Account"}
        loading={false}
        onPress={() => onSubmit({ fullName, email, password, confirmPassword })}
        style={styles.button}
      />
    </View>
  );
});

export default function Setup() {
  const route = useRouter();
  const { Colors, Fonts, Styles } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles);

  const tabs = useMemo(
    () => [
      {
        id: "login",
        name: "Login",
        content: (
          <LoginForm
            onSubmit={({ email, password }) => {
              if (!email || !password) {
                Alert.alert("Error", "Please fill in all fields.");
                return;
              }

              if (!isValidEmail(email)) {
                Alert.alert("Error", "Please enter a valid email address.");
                return;
              }

              Alert.alert(
                "Connection",
                `Email: ${email}\nPassword: ${password}`
              );
            }}
          />
        ),
      },
      {
        id: "register",
        name: "Register",
        content: (
          <RegisterForm
            onSubmit={({ fullName, email, password, confirmPassword }) => {
              if (!fullName || !email || !password || !confirmPassword) {
                Alert.alert("Error", "Please fill in all fields.");
                return;
              }
              if (!isValidEmail(email)) {
                Alert.alert("Error", "Please enter a valid email address.");
                return;
              }
              if (password !== confirmPassword) {
                Alert.alert("Error", "Passwords do not match.");
                return;
              }
              Alert.alert(
                "Registration",
                `Full Name: ${fullName}\nEmail: ${email}\nPassword: ${password}`
              );
            }}
          />
        ),
      },
    ],
    []
  );

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
        // onTabChange={(tab) => console.log(`Selected tab : ${tab.name}`)}
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
      marginTop: Styles.margin.xl,
    },
    description: {
      color: Colors.bw,
      opacity: Styles.opacity.xl,
      fontSize: Fonts.sizes.md,
      fontFamily: Fonts.family.FredokaRegular,
      textAlign: "center",
      marginTop: Styles.margin.sm,
      marginBottom: Styles.margin.xxl,
    },
    formContainer: {
      paddingHorizontal: Styles.padding.xs,
      paddingVertical: Styles.padding.xxxl,
      backgroundColor: Colors.background,
      flex: 1,
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
    eyeIcon: {
      position: "absolute",
      right: 15,
      top: 40,
    },
  });
