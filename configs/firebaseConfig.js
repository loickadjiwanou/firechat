import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDThUvGk7O92_MxthbyZHyuDqV_vOGyT_E",
  authDomain: "fir-chat-192da.firebaseapp.com",
  projectId: "fir-chat-192da",
  storageBucket: "fir-chat-192da.firebasestorage.app",
  messagingSenderId: "39286932579",
  appId: "1:39286932579:web:059b38fe4740944c096456",
  measurementId: "G-Z5V1VKH3DH",
};

// Initialize Firebase app (use existing if already initialized)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth only once
let auth;
try {
  auth = getAuth(app);
} catch (e) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

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
