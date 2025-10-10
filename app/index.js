import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Platform, Alert } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { useFocusEffect } from "expo-router";
import SwipeBar from "../components/SwipeBar";
import Modal from "react-native-modal";
import appIcon from "../assets/icons/icon-no-bg.png";
import LottieView from "lottie-react-native";
import chatAnimation from "../assets/animations/chat.json";

export default function MyComponent() {
  const { Colors, Fonts, Styles } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles);

  const [modalVisible, setModalVisible] = useState(false);
  const [hasSeenModal, setHasSeenModal] = useState(false);

  useEffect(() => {
    if (!hasSeenModal) {
      const timer = setTimeout(() => setModalVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, [hasSeenModal]);

  useFocusEffect(
    React.useCallback(() => {
      if (!hasSeenModal) {
        const timer = setTimeout(() => setModalVisible(true), 500);
        return () => clearTimeout(timer);
      }
    }, [hasSeenModal])
  );

  const handleComplete = () => {
    setModalVisible(false);
    setHasSeenModal(true);
  };

  return (
    <View style={styles.container}>
      {/* Header avec logo */}
      <View style={styles.titleContainer}>
        <Image source={appIcon} style={styles.appIcon} />
        <Text style={styles.title}>FireChat</Text>
      </View>

      {/* Animation Lottie */}
      <LottieView
        source={chatAnimation}
        autoPlay
        loop
        speed={1.5}
        style={styles.lottiestyle}
      />

      {/* Modal */}
      <Modal
        isVisible={modalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={500}
        animationOutTiming={500}
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={500}
        backdropOpacity={0}
        onBackdropPress={() => {}}
        useNativeDriver
        useNativeDriverForBackdrop
        hideModalContentWhileAnimating
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Welcome to FireChat!</Text>
          <Text style={styles.modalSubText}>
            Connect and chat instantly with friends.
          </Text>
          <View style={styles.swipeBar}>
            <SwipeBar route="onboarding" onComplete={handleComplete} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (Colors, Fonts, Styles) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.primaryBlue,
    },
    lottiestyle: {
      width: 450,
      height: 450,
      alignSelf: "center",
      top: 110,
    },
    titleContainer: {
      position: "absolute",
      top: 75,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 5,
      alignSelf: "center",
    },
    appIcon: {
      width: 40,
      height: 40,
    },
    title: {
      fontSize: Fonts.sizes.xxxl,
      fontFamily: Fonts.family.FredokaMedium,
      color: Colors.background,
    },
    modal: {
      justifyContent: "flex-end",
      margin: 0,
    },
    modalContent: {
      backgroundColor: Colors.background,
      height: 250,
      width: "97%",
      position: "absolute",
      bottom: 22,
      alignSelf: "center",
      padding: Styles.padding.md,
      borderRadius: Styles.borderRadius.xxxl,
      alignItems: "center",
    },
    modalText: {
      fontSize: Fonts.sizes.xxxl,
      fontFamily: Fonts.family.FredokaRegular,
      color: Colors.text,
      marginBottom: Styles.margin.md,
      top: 10,
    },
    modalSubText: {
      fontSize: Fonts.sizes.lg,
      fontFamily: Fonts.family.FredokaRegular,
      color: Colors.text,
      textAlign: "center",
      marginBottom: Styles.margin.md,
      top: 10,
    },
    swipeBar: {
      position: "absolute",
      bottom: 40,
    },
  });
