import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useTheme } from "../hooks/useTheme";

export default function Loader({
  visible = false,
  message = "Loading...",
  size = "large",
  color = "#2196F3",
  backgroundColor = "rgba(0,0,0,0.4)",
  textColor = "#ffffff",
  delay = 2000, // display duration
  withDelay = false, // use delay ?
  onHide, // fallback function
}) {
  const [show, setShow] = useState(visible);
  const { Colors, Styles, Fonts } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles);

  useEffect(() => {
    setShow(visible);
    let timer;
    if (visible && withDelay) {
      timer = setTimeout(() => {
        setShow(false);
        onHide?.();
      }, delay);
    }
    return () => timer && clearTimeout(timer);
  }, [visible, withDelay, delay]);

  if (!show) return null;

  return (
    <View style={[styles.overlay, { backgroundColor }]}>
      <View style={styles.container}>
        <ActivityIndicator size={size} color={color} />
        {message && (
          <Text style={[styles.message, { color: textColor }]}>{message}</Text>
        )}
      </View>
    </View>
  );
}

const createStyles = (Colors, Fonts, Styles) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    },
    container: {
      backgroundColor: Colors.transparent,
      paddingVertical: 20,
      paddingHorizontal: 30,
      borderRadius: 15,
      alignItems: "center",
    },
    message: {
      marginTop: 10,
      fontSize: Fonts.sizes.lg,
      fontFamily: Fonts.family.FredokaRegular,
      textAlign: "center",
    },
  });
