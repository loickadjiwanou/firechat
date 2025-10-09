import React, { useState, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { useLocalSearchParams } from "expo-router";
import { db, auth } from "../../configs/firebaseConfig";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  getDoc,
} from "firebase/firestore";
import { View } from "react-native";
import UserBar from "../../components/UserBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";

export default function ChatRoom() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [otherUserId, setOtherUserId] = useState(null);
  const [otherUserData, setOtherUserData] = useState(null);
  const user = auth.currentUser;
  const { Colors } = useTheme();
  const { top } = useSafeAreaInsets();

  // Charger les données du chat et de l'autre utilisateur
  useEffect(() => {
    const fetchChatData = async () => {
      const chatDoc = await getDoc(doc(db, "chats", id));
      if (chatDoc.exists()) {
        const participants = chatDoc.data().participants;
        const otherId = participants.find((uid) => uid !== user.uid);
        setOtherUserId(otherId);
        const userDoc = await getDoc(doc(db, "users", otherId));
        if (userDoc.exists()) {
          setOtherUserData(userDoc.data());
        }
      }
    };
    fetchChatData();
  }, [id]);

  // Charger les messages
  useEffect(() => {
    const q = query(
      collection(db, `chats/${id}/messages`),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        _id: doc.id,
        text: doc.data().text,
        createdAt: doc.data().timestamp?.toDate() || new Date(),
        user: {
          _id: doc.data().senderId,
          name: doc.data().senderName,
        },
      }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [id]);

  const onSend = async (newMessages = []) => {
    if (!otherUserId) return;
    const msg = newMessages[0];
    await addDoc(collection(db, `chats/${id}/messages`), {
      text: msg.text,
      senderId: user.uid,
      senderName: user.displayName,
      timestamp: serverTimestamp(),
    });
    await updateDoc(doc(db, "chats", id), {
      lastMessage: { text: msg.text, timestamp: serverTimestamp() },
      [`unreadCount.${otherUserId}`]: increment(1),
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 100 }}>
        <UserBar
          path={otherUserData?.displayName || "Chat"}
          pathData={{ nb: 0 }}
          backgroundColor={Colors.userBarBackground}
          backArrow={true}
          searchIcon={false}
          moreIcon={true}
          onPressMore={() => console.log("More options")}
          barStyles={{
            paddingTop: top,
            paddingHorizontal: 10,
            paddingBottom: 10,
          }}
        />
      </View>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{ _id: user.uid, name: user.displayName }}
      />
    </View>
  );
}
