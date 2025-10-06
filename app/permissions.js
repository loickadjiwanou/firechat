import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../hooks/useTheme";
import { useToast } from "../hooks/useToast";
import Button from "../components/Button";
import {
  checkAllPermissions,
  requestCameraPermission,
  requestAudioPermission,
  requestLocationPermission,
  requestStoragePermission,
  requestPhoneCallPermission,
} from "../hooks/usePermissions";

export default function PermissionsScreen() {
  const { Colors, Fonts, Styles } = useTheme();
  const { showToast } = useToast();
  const router = useRouter();
  const [permissionsStatus, setPermissionsStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const styles = createStyles(Colors, Fonts, Styles);

  // Vérifier les permissions au montage
  useEffect(() => {
    const checkPermissions = async () => {
      const permissions = await checkAllPermissions();
      setPermissionsStatus(permissions);

      // Vérifier si toutes les permissions sont accordées
      if (
        permissions.camera?.granted &&
        permissions.audio?.granted &&
        permissions.location?.granted &&
        permissions.storage?.granted &&
        permissions.phoneCall?.granted
      ) {
        showToast({
          type: "success",
          message: "Toutes les permissions accordées",
          subMessage: "Redirection vers l'accueil...",
        });
        setTimeout(() => router.replace("/home"), 1000); // Délai pour afficher le toast
      }
    };

    checkPermissions();
  }, []);

  // Demander les permissions manquantes
  const requestMissingPermissions = async () => {
    setLoading(true);
    let allGranted = true;

    if (!permissionsStatus?.camera?.granted) {
      const result = await requestCameraPermission();
      showToast({
        type: result.granted ? "success" : "error",
        message: result.granted ? "Caméra autorisée" : "Caméra refusée",
        subMessage: result.error || "",
      });
      allGranted = allGranted && result.granted;
    }

    if (!permissionsStatus?.audio?.granted) {
      const result = await requestAudioPermission();
      showToast({
        type: result.granted ? "success" : "error",
        message: result.granted ? "Audio autorisé" : "Audio refusé",
        subMessage: result.error || "",
      });
      allGranted = allGranted && result.granted;
    }

    if (!permissionsStatus?.location?.granted) {
      const result = await requestLocationPermission();
      showToast({
        type: result.granted ? "success" : "error",
        message: result.granted
          ? "Localisation autorisée"
          : "Localisation refusée",
        subMessage: result.error || "",
      });
      allGranted = allGranted && result.granted;
    }

    if (!permissionsStatus?.storage?.granted) {
      const result = await requestStoragePermission();
      showToast({
        type: result.granted ? "success" : "error",
        message: result.granted ? "Stockage autorisé" : "Stockage refusé",
        subMessage: result.error || "",
      });
      allGranted = allGranted && result.granted;
    }

    if (!permissionsStatus?.phoneCall?.granted) {
      const result = await requestPhoneCallPermission();
      showToast({
        type: result.granted ? "success" : "error",
        message: result.granted ? "Appels autorisés" : "Appels refusés",
        subMessage: result.error || "",
      });
      allGranted = allGranted && result.granted;
    }

    // Mettre à jour l'état des permissions
    const updatedPermissions = await checkAllPermissions();
    setPermissionsStatus(updatedPermissions);

    // Rediriger vers /home si toutes les permissions sont accordées
    if (allGranted) {
      showToast({
        type: "success",
        message: "Toutes les permissions accordées",
        subMessage: "Redirection vers l'accueil...",
      });
      setTimeout(() => router.replace("/home"), 1000);
    }

    setLoading(false);
  };

  // Afficher un écran de chargement si les permissions ne sont pas encore vérifiées
  if (!permissionsStatus) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Vérification des permissions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Autorisations Requises</Text>
      <Text style={styles.subtitle}>
        Nous avons besoin de certaines permissions pour offrir la meilleure
        expérience possible.
      </Text>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Caméra:{" "}
          {permissionsStatus.camera?.granted
            ? "✅ Accordée"
            : "❌ Non accordée"}
        </Text>
        <Text style={styles.statusText}>
          Audio:{" "}
          {permissionsStatus.audio?.granted ? "✅ Accordée" : "❌ Non accordée"}
        </Text>
        <Text style={styles.statusText}>
          Localisation:{" "}
          {permissionsStatus.location?.granted
            ? "✅ Accordée"
            : "❌ Non accordée"}
        </Text>
        <Text style={styles.statusText}>
          Stockage:{" "}
          {permissionsStatus.storage?.granted
            ? "✅ Accordée"
            : "❌ Non accordée"}
        </Text>
        <Text style={styles.statusText}>
          Appels:{" "}
          {permissionsStatus.phoneCall?.granted
            ? "✅ Accordée"
            : "❌ Non accordée"}
        </Text>
      </View>
      <Button
        title="Demander les permissions"
        loading={loading}
        onPress={requestMissingPermissions}
        style={styles.button}
      />
    </View>
  );
}

const createStyles = (Colors, Fonts, Styles) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 50,
      paddingHorizontal: Styles.padding.sm,
      justifyContent: "center",
      alignItems: "center",
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
      marginBottom: Styles.margin.lg,
    },
    statusContainer: {
      marginVertical: Styles.margin.lg,
      alignItems: "flex-start",
    },
    statusText: {
      color: Colors.bw,
      fontSize: Fonts.sizes.md,
      fontFamily: Fonts.family.FredokaRegular,
      marginBottom: Styles.margin.sm,
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
