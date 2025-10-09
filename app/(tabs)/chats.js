import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { auth, db } from "../../configs/firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { router } from "expo-router";
import profilepicPlaceholder from "../../assets/images/profilepic.png";

export default function ChatsScreen() {
  const { Colors, Styles, Fonts } = useTheme();
  const styles = createStyles(Colors, Fonts, Styles);
  const [chats, setChats] = useState([]);
  const [usersData, setUsersData] = useState({});
  const user = auth.currentUser;

  // Load chats
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      chatsData.sort(
        (a, b) =>
          (b.lastMessage?.timestamp?.seconds || 0) -
          (a.lastMessage?.timestamp?.seconds || 0)
      );
      setChats(chatsData);

      // Load other users data
      chatsData.forEach((chat) => {
        const otherUserId = chat.participants.find((uid) => uid !== user.uid);
        if (otherUserId && !usersData[otherUserId]) {
          getDoc(doc(db, "users", otherUserId)).then((userDoc) => {
            if (userDoc.exists()) {
              setUsersData((prev) => ({
                ...prev,
                [otherUserId]: userDoc.data(),
              }));
            }
          });
        }
      });
    });

    return () => unsubscribe();
  }, [user, usersData]);

  // Filter chats based on search query
  const filteredChats = chats.filter((chat) => {
    const otherUserId = chat.participants.find((uid) => uid !== user.uid);
    const recipient = usersData[otherUserId] || {};
    const recipientName = recipient.displayName || "Unknown";
    return recipientName;
  });

  const handleChatPress = (chatId) => {
    router.push(`/chat-room/${chatId}`);
  };

  const renderChatItem = ({ item }) => {
    const otherUserId = item.participants.find((uid) => uid !== user.uid);
    const recipient = usersData[otherUserId] || {};
    const recipientName = recipient.displayName || "Unknown";
    const lastMsg = item.lastMessage?.text || "No messages";
    const timestamp =
      item.lastMessage?.timestamp?.toDate()?.toLocaleTimeString() || "";

    return (
      <>
        <TouchableOpacity
          onPress={() => handleChatPress(item.id)}
          style={styles.chatItem}
        >
          <Image
            source={
              recipient.photoURL
                ? { uri: recipient.photoURL }
                : profilepicPlaceholder
            }
            style={styles.profilePic}
          />
          <View style={styles.infoContainer}>
            <View style={styles.nameAndTime}>
              <Text style={styles.name}>{recipientName}</Text>
              <Text style={styles.timestamp}>{timestamp.slice(0, 5)}</Text>
            </View>
            <Text style={styles.lastMessage}>{lastMsg}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
      </>
    );
  };

  return (
    <View style={styles.view}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        style={styles.container}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        // bounces={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              // Handle refresh
            }}
            colors={[Colors.primaryBlue]}
          />
        }
      >
        {filteredChats.map((item) => (
          <View key={item.id}>{renderChatItem({ item })}</View>
        ))}
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

const createStyles = (Colors, Fonts, Styles) =>
  StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: Colors.userBarBackground,
      paddingTop: 75,
    },
    container: {
      backgroundColor: Colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: Styles.padding.sm,
      paddingVertical: 10,
    },
    footer: {
      paddingBottom: 180,
    },
    chatItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      width: "100%",
    },
    separator: {
      height: 1,
      backgroundColor: Colors.separator,
      marginVertical: 10,
    },
    profilePic: {
      width: 50,
      height: 50,
      borderRadius: 50,
    },
    infoContainer: {
      flex: 1,
      marginLeft: 12,
    },
    nameAndTime: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    name: {
      fontSize: Fonts.sizes.md,
      fontFamily: Fonts.family.FredokaMedium,
      color: Colors.text,
    },
    timestamp: {
      fontSize: Fonts.sizes.sm,
      fontFamily: Fonts.family.FredokaRegular,
      color: Colors.gray,
    },
    lastMessage: {
      fontSize: Fonts.sizes.sm,
      fontFamily: Fonts.family.FredokaRegular,
      color: Colors.gray,
    },
  });
