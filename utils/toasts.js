import { Toast } from "toastify-react-native";
import { useTheme } from "../hooks/useTheme";

export const showToast = ({
  type,
  message,
  subMessage,
  position,
  visibilityTime,
  autoHide,
  onPress,
  onShow,
  onHide,
}) => {
  Toast.show({
    type: type || "success",
    text1: message || "No message",
    text2: subMessage || "No sub-message",
    position: position || "bottom",
    visibilityTime: visibilityTime || 4000,
    autoHide: autoHide || true,
    onPress: () => onPress,
    onShow: () => onShow,
    onHide: () => onHide,
  });
};
