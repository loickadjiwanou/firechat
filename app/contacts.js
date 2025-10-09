import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../hooks/useTheme";
import { auth, db } from "../configs/firebaseConfig";
import {
  collection,
  query,
  onSnapshot,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { router } from "expo-router";
import profilepicPlaceholder from "../assets/images/profilepic.png";
import * as Contacts from "expo-contacts";
import { useToast } from "../hooks/useToast";

export default function ContactsScreen() {
  const { Colors, Styles, Fonts } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = auth.currentUser;
  const { genericErrorToast } = useToast();

  // Load users
  useEffect(() => {
    if (!user) {
      console.log("No authenticated user");
      setError("login is required");
      setLoading(false);
      return;
    }

    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // console.log("Firestore users:", usersData);
        setUsers(usersData);
        setLoading(false);
      },
      (error) => {
        console.log("Firestore error:", error);
        setError("Failed to load contacts :" + error.message);
        genericErrorToast("Failed to load contacts :" + error.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user]);

  // Load phone contacts
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      console.log("Contact permissions status:", status);
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails, Contacts.Fields.Name],
        });
        console.log("Phone contacts:", data);
        setContacts(data);
      } else {
        console.log("Contact permissions denied");
        setError("access to contacts is denied");
        genericErrorToast("access to contacts is denied");
      }
      setLoading(false);
    })();
  }, []);

  const createChat = async (recipient) => {
    let recipientId = recipient.id;
    try {
      console.log(
        "Creating chat with user:",
        user.uid,
        "and recipient:",
        recipientId
      );
      const chatId = [user.uid, recipientId].sort().join("_");
      console.log("Chat ID:", chatId);
      await setDoc(
        doc(db, "chats", chatId),
        {
          participants: [user.uid, recipientId],
          lastMessage: { text: "", timestamp: serverTimestamp() },
          unreadCount: { [user.uid]: 0, [recipientId]: 0 },
        },
        { merge: true }
      );
      console.log("Chat created successfully ", chatId);
      router.replace(`/chat-room/${chatId}`);
    } catch (error) {
      console.log("Error creating chat:", error);
      setError("Échec de la création du chat : " + error.message);
      genericErrorToast("Échec de la création du chat : " + error.message);
    }
  };

  const renderContactItem = ({ item }) => {
    const contactEmails = item.emails
      ? item.emails.map((e) => e.email?.toLowerCase()).filter(Boolean)
      : [];
    const matchedUser = users.find((u) =>
      contactEmails.includes(u.email?.toLowerCase())
    );
    console.log(
      `Checking contact: ${item.name}, Emails: ${contactEmails.join(
        ", "
      )}, Matched: ${!!matchedUser}`
    );

    if (!matchedUser) return null;

    return (
      <TouchableOpacity
        onPress={() => createChat(matchedUser)}
        style={styles.contactItem}
      >
        <Image
          source={matchedUser.photoURL || profilepicPlaceholder}
          style={styles.profilePic}
        />
        <Text style={styles.name}>{matchedUser.displayName || item.name}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.view}>
        <ActivityIndicator
          size="large"
          color={Colors.text}
          style={styles.loader}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.view}>
        <Text style={styles.noContactsText}>{error}</Text>
      </View>
    );
  }

  const matchedContacts = contacts.filter((contact) => {
    const contactEmails = contact.emails
      ? contact.emails.map((e) => e.email?.toLowerCase()).filter(Boolean)
      : [];
    return users.some((u) => contactEmails.includes(u.email?.toLowerCase()));
  });

  if (matchedContacts.length === 0) {
    return (
      <View style={styles.view}>
        <Text style={styles.noContactsText}>
          Aucun contact trouvé avec un compte Firestore correspondant.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.view}>
      <FlatList
        data={matchedContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContactItem}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const createStyles = (Colors, Fonts, Styles) =>
  StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: Colors.userBarBackground,
    },
    container: {
      backgroundColor: Colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: Styles.padding.sm,
      paddingVertical: 10,
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
    },
    profilePic: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    name: {
      fontSize: 16,
      fontWeight: "bold",
      color: Colors.text,
    },
    noContactsText: {
      fontSize: 16,
      color: Colors.text,
      textAlign: "center",
      marginTop: 20,
    },
    loader: {
      marginTop: 20,
    },
  });
