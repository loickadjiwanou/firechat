import React, { useState, useEffect } from "react";
import { GiftedChat, Message } from "react-native-gifted-chat";
import { useLocalSearchParams, router } from "expo-router";
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
  arrayUnion,
} from "firebase/firestore";
import { View, Text, StyleSheet } from "react-native";
import UserChatBar from "../../components/UserChatBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import Loader from "../../components/Loader";
import ChatInput from "../../components/ChatInput";
import { Ionicons } from "@expo/vector-icons";

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

  // Load messages and mark as read
  useEffect(() => {
    const q = query(
      collection(db, `chats/${id}/messages`),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          _id: doc.id,
          text: doc.data().text,
          createdAt: doc.data().timestamp?.toDate() || new Date(),
          user: {
            _id: doc.data().senderId,
            name: doc.data().senderName,
          },
          readBy: doc.data().readBy || [doc.data().senderId], // Ajout de readBy
        }));

        // Marquer les messages non lus comme lus par l'utilisateur actuel
        const unreadMessages = snapshot.docs.filter(
          (doc) =>
            doc.data().senderId !== user.uid &&
            !doc.data().readBy?.includes(user.uid)
        );
        for (const doc of unreadMessages) {
          await updateDoc(doc.ref, {
            readBy: arrayUnion(user.uid),
          });
        }

        setMessages(msgs);
      },
      (error) => {
        console.error("Error fetching messages :", error);
      }
    );
    return () => unsubscribe();
  }, [id, user.uid]);

  const onSend = async (newMessages = []) => {
    if (!otherUserId || !newMessages.length) return;
    const msg = newMessages[0];
    try {
      await addDoc(collection(db, `chats/${id}/messages`), {
        text: msg.text,
        senderId: user.uid,
        senderName: user.displayName,
        timestamp: serverTimestamp(),
        readBy: [user.uid], // Initialiser readBy avec l'expéditeur
      });
      await updateDoc(doc(db, "chats", id), {
        lastMessage: { text: msg.text, timestamp: serverTimestamp() },
        [`unreadCount.${otherUserId}`]: increment(1),
      });
    } catch (error) {
      console.error("Error sending message :", error);
    }
  };

  // Rendre input toolbar avec ChatInput
  const renderInputToolbar = (props) => {
    return <ChatInput onSend={onSend} />;
  };

  // Personnaliser l'affichage des messages pour les confirmations de lecture
  const renderMessage = (props) => {
    const { currentMessage } = props;
    const isMyMessage = currentMessage.user._id === user.uid;

    return (
      <View>
        <Message {...props} />
        {isMyMessage && (
          <View style={styles.readStatus}>
            {currentMessage.readBy?.includes(otherUserId) ? (
              <View style={styles.checkmarks}>
                <Ionicons
                  name="checkmark-done-outline"
                  size={16}
                  color={Colors.primaryBlue}
                />
              </View>
            ) : (
              <Ionicons name="checkmark" size={16} color={Colors.gray} />
            )}
          </View>
        )}
      </View>
    );
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
        renderMessage={renderMessage}
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

const styles = StyleSheet.create({
  readStatus: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 10,
    marginBottom: 5,
  },
  checkmarks: {
    flexDirection: "row",
  },
});
