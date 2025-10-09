// To initalize firebase database with collections, documents and test data
// run using => node init-firebase.js --env=prod

require("dotenv").config();
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function initializeFirestore() {
  try {
    console.log("Initialisation de Firestore...");

    // Créer un utilisateur de test
    const user1 = {
      displayName: "Loick Test",
      email: "loick.test@example.com",
      uid: "test-user-1",
    };
    const user2 = {
      displayName: "Jane Test",
      email: "jane.test@example.com",
      uid: "test-user-2",
    };

    await setDoc(doc(db, "users", user1.uid), user1);
    await setDoc(doc(db, "users", user2.uid), user2);
    console.log("Utilisateurs de test créés :", user1.uid, user2.uid);

    // Créer une conversation de test
    const chat = {
      participants: [user1.uid, user2.uid],
      lastMessage: {
        text: "Message initial",
        timestamp: new Date(),
      },
      unreadCount: {
        [user1.uid]: 0,
        [user2.uid]: 1,
      },
    };
    const chatRef = await addDoc(collection(db, "chats"), chat);
    console.log("Conversation de test créée avec ID :", chatRef.id);

    // Créer un message de test
    const message = {
      text: "Salut ! Ceci est un message de test.",
      senderId: user1.uid,
      senderName: user1.displayName,
      timestamp: new Date(),
      readBy: [user1.uid],
    };
    await addDoc(collection(db, `chats/${chatRef.id}/messages`), message);
    console.log("Message de test créé dans la conversation :", chatRef.id);

    console.log("Initialisation de Firestore terminée avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'initialisation de Firestore :", error);
  }
}

initializeFirestore().then(() => process.exit(0));
