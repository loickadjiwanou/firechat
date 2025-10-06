import { Platform, PermissionsAndroid } from "react-native";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";

const handlePermissionError = (permissionType, error) => {
  console.error(`Error while requesting ${permissionType}:`, error);
  return { granted: false, error: error.message };
};

// Camera
export const requestCameraPermission = async () => {
  try {
    const { status } = await Camera.requestCameraPermissionsAsync();
    return {
      granted: status === "granted",
      status,
    };
  } catch (error) {
    return handlePermissionError("camera", error);
  }
};

// Microphone
export const requestAudioPermission = async () => {
  try {
    const { status } = await Camera.requestMicrophonePermissionsAsync();
    return {
      granted: status === "granted",
      status,
    };
  } catch (error) {
    return handlePermissionError("audio", error);
  }
};

// Location
export const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return {
      granted: status === "granted",
      status,
    };
  } catch (error) {
    return handlePermissionError("location", error);
  }
};

// Storage
export const requestStoragePermission = async () => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return {
      granted: status === "granted",
      status,
    };
  } catch (error) {
    return handlePermissionError("storage", error);
  }
};

// Phone Call
export const requestPhoneCallPermission = async () => {
  try {
    if (Platform.OS === "ios") {
      return { granted: true, status: "granted" };
    }

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      {
        title: "Permission for calls",
        message: "This app needs permission to make calls.",
        buttonPositive: "OK",
        buttonNegative: "Cancel",
      }
    );

    return {
      granted: result === PermissionsAndroid.RESULTS.GRANTED,
      status:
        result === PermissionsAndroid.RESULTS.GRANTED ? "granted" : "denied",
    };
  } catch (error) {
    return handlePermissionError("calls", error);
  }
};

// Check all permissions
export const checkAllPermissions = async () => {
  try {
    const camera = await Camera.getCameraPermissionsAsync();
    const mic = await Camera.getMicrophonePermissionsAsync();
    const location = await Location.getForegroundPermissionsAsync();
    const storage = await MediaLibrary.getPermissionsAsync();

    let phoneCall = { granted: true, status: "granted" };
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE
      );
      phoneCall = { granted, status: granted ? "granted" : "denied" };
    }

    return {
      camera,
      audio: mic,
      location,
      storage,
      phoneCall,
    };
  } catch (error) {
    console.error("Error while checking permissions:", error);
    return { error: error.message };
  }
};
