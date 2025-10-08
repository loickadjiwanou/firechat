import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID,
} from "@env";

// Firebase configuration
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};

// Initialize Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Always initialize auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth };

// From firebase when creating app
// const firebaseConfig = {
//   apiKey: "AIzaSyDThUvGk7O92_MxthbyZHyuDqV_vOGyT_E",
//   authDomain: "fir-chat-192da.firebaseapp.com",
//   projectId: "fir-chat-192da",
//   storageBucket: "fir-chat-192da.firebasestorage.app",
//   messagingSenderId: "39286932579",
//   appId: "1:39286932579:web:059b38fe4740944c096456",
//   measurementId: "G-Z5V1VKH3DH"
// };
