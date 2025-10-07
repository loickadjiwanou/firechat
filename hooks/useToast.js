import { Toast } from "toastify-react-native";
import { useTheme } from "./useTheme";

export const useToast = () => {
  const { Colors, Fonts, Styles, theme } = useTheme();

  const showToast = ({
    type = "success", // 'success' | 'error' | 'info' | 'warn' | 'default'
    message = "No message", // Main message (string)
    subMessage = "", // Secondary message (string)
    position = "bottom", // 'top' | 'center' | 'bottom'
    visibilityTime = 3000, // Duration in ms before auto-hide
    autoHide = true, // Whether the toast should disappear automatically
    onPress, // Callback when toast is pressed
    onShow, // Callback when toast is shown
    onHide, // Callback when toast is hidden
    backgroundColor, // string | custom background color of the toast
    textColor, // string | color of both text1 and text2 if defined
    icon, // string | ReactNode | custom icon (e.g. "check" or <CustomIcon />)
    iconFamily = "Ionicons", // string | icon family name (e.g. "FontAwesome", "Ionicons")
    iconColor, // string | color of the icon
    iconSize = 24, // number | size of the icon
    theme = Colors.theme || "dark", // 'light' | 'dark' | predefined theme for toast styling
    useModal = false, // boolean | whether to render the toast inside a modal overlay
    closeIcon = "close", // string | ReactNode | custom close icon (e.g. "x" or <CloseIcon />)
    closeIconSize = 20, // number | size of the close icon
    closeIconColor = "#fff", // string | color of the close icon
    closeIconFamily = "Ionicons", // string | icon family for the close icon
  } = {}) => {
    Toast.show({
      type,
      text1: message,
      text2: subMessage,
      position,
      visibilityTime,
      autoHide,
      onShow,
      onPress,
      onHide,
      progressBarColor: Colors.white,
      // backgroundColor === Colors.primaryBlue ? "#fff" : Colors.primaryBlue,
      textColor: Colors.white,
      text1Style: { fontFamily: Fonts.family.FredokaRegular },
      text2Style: { fontFamily: Fonts.family.FredokaRegular },
      backgroundColor: backgroundColor || getBackgroundColor(type),
      icon: icon || getDefaultIcon(type),
      iconFamily,
      iconColor: iconColor || Colors.white,
      iconSize,
      theme,
      useModal,
      closeIcon,
      closeIconSize,
      closeIconColor,
      closeIconFamily,
    });
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case "success":
        return Colors.success;
      case "error":
        return Colors.error;
      case "info":
        return Colors.info;
      case "warn":
        return Colors.warning;
      default:
        return Colors.backgroundtoast;
    }
  };

  const getDefaultIcon = (type) => {
    switch (type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "alert-circle";
      case "info":
        return "information-circle";
      case "warn":
        return "warning";
      default:
        return "notifications";
    }
  };

  const sanitizeEmail = (email) => {
    if (typeof email !== "string" || !email.includes("@")) return email;
    return email.slice(0, email.indexOf("@"));
  };

  const loginSuccessToast = (email) => {
    showToast({
      type: "success",
      message: "Login Successful",
      subMessage: `Welcome back, ${sanitizeEmail(email)}!`,
      theme: theme,
    });
  };

  const loginErrorToast = (errorCode) => {
    let message = "Login Failed";
    let subMessage = "An error occurred during login.";
    switch (errorCode) {
      case "auth/user-not-found":
        message = "User Not Found";
        subMessage = "No account found with this email.";
        break;
      case "auth/invalid-credential":
        message = "Invalid Credential";
        subMessage = "Check your email and password.";
        break;
      case "auth/wrong-password":
        message = "Incorrect Password";
        subMessage = "The password you entered is incorrect.";
        break;
      case "auth/invalid-email":
        message = "Invalid Email";
        subMessage = "Please enter a valid email address.";
        break;
      case "auth/too-many-requests":
        message = "Too Many Attempts";
        subMessage = "Too many login attempts, please try again later.";
        break;
      default:
        subMessage = errorCode || "An unexpected error occurred.";
    }
    showToast({
      type: "error",
      message,
      subMessage,
      theme: theme,
    });
  };

  const registerSuccessToast = (email) => {
    showToast({
      type: "success",
      message: "Account Created",
      subMessage: `Welcome, ${email}!`,
      theme: theme,
    });
  };

  const registerErrorToast = (errorCode) => {
    let message = "Registration Failed";
    let subMessage = "An error occurred during registration.";
    switch (errorCode) {
      case "auth/email-already-in-use":
        message = "Email In Use";
        subMessage = "This email is already registered.";
        break;
      case "auth/weak-password":
        message = "Weak Password";
        subMessage = "Password must be at least 6 characters.";
        break;
      case "auth/invalid-email":
        message = "Invalid Email";
        subMessage = "Please enter a valid email address.";
        break;
      default:
        subMessage = errorCode || "An unexpected error occurred.";
    }
    showToast({
      type: "error",
      message,
      subMessage,
      theme: theme,
    });
  };

  const missingFieldsToast = () => {
    showToast({
      type: "error",
      message: "Missing Fields",
      subMessage: "Please fill in all fields.",
      theme: theme,
    });
  };

  const passwordsDontMatchToast = () => {
    showToast({
      type: "error",
      message: "Password Mismatch",
      subMessage: "Passwords do not match.",
      theme: theme,
    });
  };

  const genericErrorToast = (
    message,
    subMessage = "An unexpected error occurred."
  ) => {
    showToast({
      type: "error",
      message,
      subMessage,
      theme: theme,
    });
  };

  const infoToast = (message, subMessage = "", visibilityTime) => {
    showToast({
      type: "info",
      message,
      subMessage,
      visibilityTime: visibilityTime || 4000,
      theme: theme,
    });
  };

  const warningToast = (message, subMessage = "") => {
    showToast({
      type: "warn",
      message,
      subMessage,
      theme: theme,
    });
  };

  return {
    showToast,
    loginSuccessToast,
    loginErrorToast,
    registerSuccessToast,
    registerErrorToast,
    missingFieldsToast,
    passwordsDontMatchToast,
    genericErrorToast,
    infoToast,
    warningToast,
  };
};
