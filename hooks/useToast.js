// hooks/useToast.js
import { Toast } from "toastify-react-native";
import { useTheme } from "./useTheme";

export const useToast = () => {
  const { Colors } = useTheme();

  const showToast = ({
    type = "success", // 'success' | 'error' | 'info' | 'warn' | 'default'
    message = "No message", // Main message (string)
    subMessage = "No sub-message", // Secondary message (string)
    position = "bottom", // 'top' | 'center' | 'bottom'
    visibilityTime = 4000, // Duration in ms before auto-hide
    autoHide = true, // Whether the toast should disappear automatically
    onPress, // Callback when toast is pressed
    onShow, // Callback when toast is shown
    onHide, // Callback when toast is hidden
    backgroundColor, // string | custom background color of the toast
    textColor, // string | color of both text1 and text2 if defined
    icon, // string | ReactNode | custom icon (e.g. "check" or <CustomIcon />)
    iconFamily, // string | icon family name (e.g. "FontAwesome", "Ionicons")
    iconColor, // string | color of the icon
    iconSize, // number | size of the icon
    theme, // 'light' | 'dark' | predefined theme for toast styling
    useModal, // boolean | whether to render the toast inside a modal overlay
    closeIcon, // string | ReactNode | custom close icon (e.g. "x" or <CloseIcon />)
    closeIconSize, // number | size of the close icon
    closeIconColor, // string | color of the close icon
    closeIconFamily, // string | icon family for the close icon
  }) => {
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
      progressBarColor: Colors.primaryBlue || "white",
      text1Style: { color: textColor || Colors.text },
      text2Style: { color: textColor || Colors.text },
      backgroundColor, // overrides toast background
      icon,
      iconFamily,
      iconColor,
      iconSize,
      theme,
      useModal,
      closeIcon,
      closeIconSize,
      closeIconColor,
      closeIconFamily,
    });
  };

  return { showToast };
};
