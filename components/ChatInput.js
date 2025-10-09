import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");
  const { Colors, Fonts, Styles } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles);

  const handleSend = () => {
    if (text.trim()) {
      onSend([{ text: text.trim() }]);
      setText("");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type your message..."
        placeholderTextColor={Colors.gray}
        value={text}
        onChangeText={setText}
        autoFocus={true}
        returnKeyType="send"
        onSubmitEditing={handleSend}
        multiline
      />
      <TouchableOpacity
        style={styles.sendButton}
        onPress={handleSend}
        disabled={!text.trim()}
      >
        <Ionicons
          name="send"
          size={24}
          color={text.trim() ? Colors.primaryBlue : Colors.inputIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (Colors, Fonts, Styles) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderRadius: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      backgroundColor: Colors.background,
      borderColor: Colors.inputBorder,
      marginVertical: 20,
    },
    input: {
      flex: 1,
      fontSize: Fonts.sizes.md,
      paddingVertical: 8,
      paddingHorizontal: 10,
      color: Colors.text,
      fontFamily: Fonts.family.FredokaRegular,
    },
    sendButton: {
      padding: 5,
    },
  });
