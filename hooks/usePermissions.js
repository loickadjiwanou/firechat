import { Platform } from "react-native";
import * as Camera from "expo-camera";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import { PermissionsAndroid } from "react-native";

// Function to handle permission errors
const handlePermissionError = (permissionType, error) => {
  console.error(
    `Erreur lors de la demande de permission ${permissionType}:`,
    error
  );
  return { granted: false, error: error.message };
};

// Ask for camera permission
export const requestCameraPermission = async () => {
  try {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      return { granted: true };
    } else {
      return { granted: false, error: "Permission de caméra refusée" };
    }
  } catch (error) {
    return handlePermissionError("caméra", error);
  }
};

// Ask for audio permission
export const requestAudioPermission = async () => {
  try {
    const { status } = await Camera.requestMicrophonePermissionsAsync();
    if (status === "granted") {
      return { granted: true };
    } else {
      return { granted: false, error: "Permission d'audio refusée" };
    }
  } catch (error) {
    return handlePermissionError("audio", error);
  }
};

// Ask for location permission
export const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      return { granted: true };
    } else {
      return {
        granted: false,
        error: `Permission de localisation refusée (${Platform.OS})`,
      };
    }
  } catch (error) {
    return handlePermissionError("localisation", error);
  }
};

// Ask for storage permission
export const requestStoragePermission = async () => {
  try {
    if (Platform.OS === "ios") {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        return { granted: true };
      } else {
        return {
          granted: false,
          error: "Permission d'accès au stockage refusée (iOS)",
        };
      }
    } else {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        return { granted: true };
      } else {
        return {
          granted: false,
          error: "Permission d'accès au stockage refusée (Android)",
        };
      }
    }
  } catch (error) {
    return handlePermissionError("stockage", error);
  }
};

// Ask for phone call permission
export const requestPhoneCallPermission = async () => {
  try {
    if (Platform.OS === "ios") {
      // iOS don't need to ask for phone call permission
      return { granted: true };
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        {
          title: "Permission pour les appels",
          message:
            "Cette application a besoin d'accéder à l'état du téléphone pour gérer les appels.",
          buttonPositive: "OK",
          buttonNegative: "Annuler",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return { granted: true };
      } else {
        return {
          granted: false,
          error: "Permission pour les appels refusée (Android)",
        };
      }
    }
  } catch (error) {
    return handlePermissionError("appels", error);
  }
};

// Check all permissions
export const checkAllPermissions = async () => {
  const results = {
    camera: null,
    audio: null,
    location: null,
    storage: null,
    phoneCall: null,
  };

  try {
    // Check permissions
    const cameraStatus = await Camera.getCameraPermissionsAsync();
    results.camera = {
      granted: cameraStatus.status === "granted",
      status: cameraStatus.status,
    };

    // Check audio permissions
    const audioStatus = await Camera.getMicrophonePermissionsAsync();
    results.audio = {
      granted: audioStatus.status === "granted",
      status: audioStatus.status,
    };

    // Check location permissions
    const locationStatus = await Location.getForegroundPermissionsAsync();
    results.location = {
      granted: locationStatus.status === "granted",
      status: locationStatus.status,
    };

    // Check storage permissions
    const storageStatus = await MediaLibrary.getPermissionsAsync();
    results.storage = {
      granted: storageStatus.status === "granted",
      status: storageStatus.status,
    };

    // Check phone call permissions
    if (Platform.OS === "ios") {
      results.phoneCall = { granted: true, status: "granted" };
    } else {
      const phoneCallStatus = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE
      );
      results.phoneCall = {
        granted: phoneCallStatus,
        status: phoneCallStatus ? "granted" : "denied",
      };
    }

    return results;
  } catch (error) {
    console.error("Erreur lors de la vérification des permissions:", error);
    return { error: error.message };
  }
};
