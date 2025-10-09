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
import UserChatBar from "../../components/UserChatBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import Loader from "../../components/Loader";
import ChatInput from "../../components/ChatInput";

export default function ChatRoom() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [otherUserId, setOtherUserId] = useState(null);
  const [otherUserData, setOtherUserData] = useState(null);
  const user = auth.currentUser;
  const { Colors } = useTheme();
  const { top } = useSafeAreaInsets();

  // Load chat data and other user data
  useEffect(() => {
    const fetchChatData = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching chat data :", error);
      }
    };
    fetchChatData();
  }, [id]);

  // Load messages
  useEffect(() => {
    const q = query(
      collection(db, `chats/${id}/messages`),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
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
      },
      (error) => {
        console.error("Error fetching messages :", error);
      }
    );
    return () => unsubscribe();
  }, [id]);

  const onSend = async (newMessages = []) => {
    if (!otherUserId || !newMessages.length) return;
    const msg = newMessages[0];
    try {
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
    } catch (error) {
      console.error("Error sending message :", error);
    }
  };

  // Render input toolbar
  const renderInputToolbar = (props) => {
    return <ChatInput onSend={onSend} />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={{ height: 100 }}>
        <UserChatBar
          data={otherUserData}
          backgroundColor={Colors.userBarBackground}
          backArrow={true}
          searchIcon={false}
          onPressSearch={() => console.log("Search")}
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
        renderInputToolbar={renderInputToolbar}
        placeholder="Type a message..."
        scrollToBottom
      />
      <Loader
        visible={true}
        color={Colors.primaryBlue}
        textColor={Colors.text}
        withDelay={true}
        delay={1200}
      />
    </View>
  );
}
