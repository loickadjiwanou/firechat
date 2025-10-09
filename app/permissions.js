import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useTheme } from "../hooks/useTheme";
import { useToast } from "../hooks/useToast";
import Button from "../components/Button";
import { Ionicons } from "@expo/vector-icons";
import {
  checkAllPermissions,
  requestCameraPermission,
  requestAudioPermission,
  requestLocationPermission,
  requestStoragePermission,
  requestPhoneCallPermission,
  requestContactsPermission,
} from "../hooks/usePermissionsManager";

export default function PermissionsScreen() {
  const { Colors, Fonts, Styles } = useTheme();
  const { showToast } = useToast();
  const [permissionsStatus, setPermissionsStatus] = useState(null);
  const [loadingStates, setLoadingStates] = useState({
    camera: false,
    audio: false,
    location: false,
    storage: false,
    phoneCall: false,
    contacts: false,
    continue: false,
  });
  const styles = createStyles(Colors, Fonts, Styles);

  const checkAndRedirect = async () => {
    const permissions = await checkAllPermissions();
    setPermissionsStatus(permissions);

    if (
      permissions.camera?.granted &&
      permissions.audio?.granted &&
      permissions.location?.granted &&
      permissions.storage?.granted &&
      permissions.phoneCall?.granted &&
      permissions.contacts?.granted
    ) {
      setLoadingStates((prev) => ({ ...prev, continue: true }));
      showToast({
        type: "success",
        message: "All permissions granted",
        subMessage: "",
      });
      setTimeout(() => {
        router.replace("(tabs)/chats");
      }, 2000);
    }
  };

  useEffect(() => {
    checkAndRedirect();
  }, []);

  const requestPermission = async (permissionType, requestFn) => {
    setLoadingStates((prev) => ({ ...prev, [permissionType]: true }));
    try {
      const result = await requestFn();
      showToast({
        type: result.granted ? "success" : "error",
        message: result.granted
          ? `${
              permissionType.charAt(0).toUpperCase() + permissionType.slice(1)
            } granted`
          : `${
              permissionType.charAt(0).toUpperCase() + permissionType.slice(1)
            } denied`,
        subMessage: result.error || "",
      });

      await checkAndRedirect();
    } catch (error) {
      showToast({
        type: "error",
        message: `Error requesting ${permissionType}`,
        subMessage: error.message,
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [permissionType]: false }));
    }
  };

  const handleContinue = () => {
    setLoadingStates((prev) => ({ ...prev, continue: true }));
    showToast({
      type: "success",
      message: "All permissions granted",
      subMessage: "",
    });
    setTimeout(() => {
      router.replace("(tabs)/chats");
    }, 2000);
  };

  const allPermissionsGranted =
    permissionsStatus?.camera?.granted &&
    permissionsStatus?.audio?.granted &&
    permissionsStatus?.location?.granted &&
    permissionsStatus?.storage?.granted &&
    permissionsStatus?.phoneCall?.granted &&
    permissionsStatus?.contacts?.granted;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Required Authorizations</Text>
      <Text style={styles.subtitle}>
        We need these permissions to provide the best possible experience.
      </Text>

      <View style={styles.permissionsContainer}>
        {/* CAMERA */}
        <View style={styles.permissionItem}>
          <Ionicons
            name="camera"
            size={24}
            color={
              permissionsStatus?.camera?.granted ? Colors.success : Colors.error
            }
            style={styles.icon}
          />
          <View style={styles.permissionTextContainer}>
            <Text style={styles.permissionTitle}>Camera</Text>
            <Text style={styles.permissionDescription}>
              Required for taking photos and videos.
            </Text>
          </View>
          <Button
            title={permissionsStatus?.camera?.granted ? "Granted" : "Allow"}
            onPress={() => requestPermission("camera", requestCameraPermission)}
            loading={loadingStates.camera}
            style={[
              styles.permissionButton,
              permissionsStatus?.camera?.granted && styles.buttonGranted,
            ]}
            disabled={permissionsStatus?.camera?.granted}
          />
        </View>

        {/* AUDIO */}
        <View style={styles.permissionItem}>
          <Ionicons
            name="mic"
            size={24}
            color={
              permissionsStatus?.audio?.granted ? Colors.success : Colors.error
            }
            style={styles.icon}
          />
          <View style={styles.permissionTextContainer}>
            <Text style={styles.permissionTitle}>Audio</Text>
            <Text style={styles.permissionDescription}>
              Required for recording audio or making calls.
            </Text>
          </View>
          <Button
            title={permissionsStatus?.audio?.granted ? "Granted" : "Allow"}
            onPress={() => requestPermission("audio", requestAudioPermission)}
            loading={loadingStates.audio}
            style={[
              styles.permissionButton,
              permissionsStatus?.audio?.granted && styles.buttonGranted,
            ]}
            disabled={permissionsStatus?.audio?.granted}
          />
        </View>

        {/* LOCATION */}
        <View style={styles.permissionItem}>
          <Ionicons
            name="location"
            size={24}
            color={
              permissionsStatus?.location?.granted
                ? Colors.success
                : Colors.error
            }
            style={styles.icon}
          />
          <View style={styles.permissionTextContainer}>
            <Text style={styles.permissionTitle}>Location</Text>
            <Text style={styles.permissionDescription}>
              Necessary to provide location-based services.
            </Text>
          </View>
          <Button
            title={permissionsStatus?.location?.granted ? "Granted" : "Allow"}
            onPress={() =>
              requestPermission("location", requestLocationPermission)
            }
            loading={loadingStates.location}
            style={[
              styles.permissionButton,
              permissionsStatus?.location?.granted && styles.buttonGranted,
            ]}
            disabled={permissionsStatus?.location?.granted}
          />
        </View>

        {/* STORAGE */}
        <View style={styles.permissionItem}>
          <Ionicons
            name="folder"
            size={24}
            color={
              permissionsStatus?.storage?.granted
                ? Colors.success
                : Colors.error
            }
            style={styles.icon}
          />
          <View style={styles.permissionTextContainer}>
            <Text style={styles.permissionTitle}>Storage</Text>
            <Text style={styles.permissionDescription}>
              Required to access your photos and files.
            </Text>
          </View>
          <Button
            title={permissionsStatus?.storage?.granted ? "Granted" : "Allow"}
            onPress={() =>
              requestPermission("storage", requestStoragePermission)
            }
            loading={loadingStates.storage}
            style={[
              styles.permissionButton,
              permissionsStatus?.storage?.granted && styles.buttonGranted,
            ]}
            disabled={permissionsStatus?.storage?.granted}
          />
        </View>

        {/* PHONE CALL */}
        <View style={styles.permissionItem}>
          <Ionicons
            name="call"
            size={24}
            color={
              permissionsStatus?.phoneCall?.granted
                ? Colors.success
                : Colors.error
            }
            style={styles.icon}
          />
          <View style={styles.permissionTextContainer}>
            <Text style={styles.permissionTitle}>Calls</Text>
            <Text style={styles.permissionDescription}>
              Required to manage phone calls.
            </Text>
          </View>
          <Button
            title={permissionsStatus?.phoneCall?.granted ? "Granted" : "Allow"}
            onPress={() =>
              requestPermission("phoneCall", requestPhoneCallPermission)
            }
            loading={loadingStates.phoneCall}
            style={[
              styles.permissionButton,
              permissionsStatus?.phoneCall?.granted && styles.buttonGranted,
            ]}
            disabled={permissionsStatus?.phoneCall?.granted}
          />
        </View>

        {/* CONTACTS */}
        <View style={styles.permissionItem}>
          <Ionicons
            name="people"
            size={24}
            color={
              permissionsStatus?.contacts?.granted
                ? Colors.success
                : Colors.error
            }
            style={styles.icon}
          />
          <View style={styles.permissionTextContainer}>
            <Text style={styles.permissionTitle}>Contacts</Text>
            <Text style={styles.permissionDescription}>
              Required to access your phone contacts.
            </Text>
          </View>
          <Button
            title={permissionsStatus?.contacts?.granted ? "Granted" : "Allow"}
            onPress={() =>
              requestPermission("contacts", requestContactsPermission)
            }
            loading={loadingStates.contacts}
            style={[
              styles.permissionButton,
              permissionsStatus?.contacts?.granted && styles.buttonGranted,
            ]}
            disabled={permissionsStatus?.contacts?.granted}
          />
        </View>
      </View>

      <Button
        title="Next"
        onPress={handleContinue}
        loading={loadingStates.continue}
        style={[
          styles.continueButton,
          !allPermissionsGranted && styles.buttonDisabled,
        ]}
        disabled={!allPermissionsGranted}
      />
    </ScrollView>
  );
}

const createStyles = (Colors, Fonts, Styles) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 20 : 60,
      paddingHorizontal: Styles.padding.sm,
    },
    contentContainer: {
      paddingBottom: Styles.padding.xl,
    },
    title: {
      color: Colors.bw,
      fontSize: Fonts.sizes.xxl,
      fontFamily: Fonts.family.FredokaMedium,
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
      marginBottom: Styles.margin.xxl,
    },
    permissionsContainer: {
      marginVertical: Styles.margin.lg,
    },
    permissionItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.background + "10",
      borderRadius: Styles.borderRadius.xl,
      padding: Styles.padding.md,
      marginBottom: Styles.margin.md,
      elevation: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    icon: {
      marginRight: Styles.margin.md,
    },
    permissionTextContainer: {
      flex: 1,
    },
    permissionTitle: {
      color: Colors.bw,
      fontSize: Fonts.sizes.lg,
      fontFamily: Fonts.family.FredokaMedium,
    },
    permissionDescription: {
      color: Colors.bw,
      opacity: Styles.opacity.xl,
      fontSize: Fonts.sizes.sm,
      fontFamily: Fonts.family.FredokaRegular,
    },
    permissionButton: {
      backgroundColor: Colors.primaryBlue,
      borderRadius: Styles.borderRadius.lg,
      height: Styles.size.md,
      paddingHorizontal: Styles.padding.md,
      minWidth: 100,
      minHeight: 40,
    },
    buttonGranted: {
      backgroundColor: Colors.success,
      opacity: 0.7,
    },
    continueButton: {
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
    buttonDisabled: {
      backgroundColor: Colors.bw + "40",
      opacity: 0.5,
    },
  });
