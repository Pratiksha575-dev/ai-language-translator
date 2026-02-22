import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const languages = ["French", "Spanish", "German", "Hindi"];

export default function HomeScreen() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("French");
  const [inputText, setInputText] = useState("");

  const [chats, setChats] = useState([
    {
      id: "1",
      name: "Chat 1",
      messages: [
        { id: "1", type: "bot", text: "Welcome to AI Translator 👋" },
      ],
    },
  ]);

  const [activeChatId, setActiveChatId] = useState("1");

  const activeChat = chats.find(chat => chat.id === activeChatId);

  const slideAnim = useRef(new Animated.Value(-250)).current;
  const flatListRef = useRef(null);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [activeChat?.messages]);

  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: sidebarOpen ? -250 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setSidebarOpen(!sidebarOpen);
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      type: "user",
      text: inputText,
    };

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    );

    setInputText("");
  };

  const createNewChat = () => {
    const newChatId = Date.now().toString();

    const newChat = {
      id: newChatId,
      name: `Chat ${chats.length + 1}`,
      messages: [],
    };

    setChats(prev => [...prev, newChat]);
    setActiveChatId(newChatId);
    toggleSidebar();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>

          {/* Sidebar */}
          <Animated.View
            style={[
              styles.sidebar,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <Text style={styles.sidebarTitle}>Chats</Text>

            <TouchableOpacity
              style={styles.newChatButton}
              onPress={createNewChat}
            >
              <Text style={styles.newChatText}>+ New Chat</Text>
            </TouchableOpacity>

            <FlatList
              data={chats}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setActiveChatId(item.id);
                    toggleSidebar();
                  }}
                  style={[
                    styles.chatItem,
                    item.id === activeChatId && { backgroundColor: "#333" }
                  ]}
                >
                  <Text style={styles.chatText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </Animated.View>

          {sidebarOpen && (
            <TouchableOpacity
              style={styles.overlay}
              activeOpacity={1}
              onPress={toggleSidebar}
            />
          )}

          {/* Main Area */}
          <View style={styles.mainContent}>

            {/* Header */}
            <View style={styles.header}>
              <Ionicons
                name="menu"
                size={24}
                color="white"
                onPress={toggleSidebar}
              />
              <Text style={styles.headerTitle}>AI Language Translator</Text>
              <Ionicons name="settings-outline" size={24} color="white" />
            </View>

            {/* Chat Messages */}
            <View style={{ flex: 1 }}>
              <FlatList
                ref={flatListRef}
                data={activeChat?.messages}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 15 }}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.messageBubble,
                      item.type === "user"
                        ? styles.userBubble
                        : styles.botBubble,
                    ]}
                  >
                    <Text style={styles.messageText}>{item.text}</Text>
                  </View>
                )}
              />
            </View>

            {/* Language Selector */}
            <View style={styles.languageContainer}>
              <Text style={{ color: "white" }}>Target:</Text>

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={languages}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => setSelectedLanguage(item)}
                    style={[
                      styles.languageButton,
                      selectedLanguage === item && {
                        backgroundColor: "#2f80ed",
                      },
                    ]}
                  >
                    <Text style={{ color: "white" }}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Input Area */}
            <View style={styles.inputContainer}>
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type your message..."
                placeholderTextColor="#aaa"
                style={styles.input}
                multiline
              />

              <TouchableOpacity style={styles.micButton}>
                <Ionicons name="mic" size={20} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sendButton}
                onPress={sendMessage}
              >
                <Ionicons name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },

  sidebar: {
    width: 250,
    backgroundColor: "#1e1e1e",
    padding: 20,
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 20,
  },

  sidebarTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },

  newChatButton: {
    paddingVertical: 12,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },

  newChatText: {
    color: "#2f80ed",
    fontWeight: "bold",
  },

  chatItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },

  chatText: {
    color: "#ddd",
  },

  overlay: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 10,
  },

  mainContent: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },

  headerTitle: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },

  messageBubble: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    maxWidth: "80%",
  },

  userBubble: {
    backgroundColor: "#2f80ed",
    alignSelf: "flex-end",
  },

  botBubble: {
    backgroundColor: "#1e1e1e",
    alignSelf: "flex-start",
  },

  messageText: {
    color: "white",
  },

  languageContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },

  languageButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#333",
    borderRadius: 15,
    marginLeft: 10,
  },

  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#222",
    alignItems: "center",
    backgroundColor: "#121212",
  },

  input: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    color: "white",
    padding: 10,
    borderRadius: 20,
    marginRight: 8,
  },

  micButton: {
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 50,
    marginRight: 8,
  },

  sendButton: {
    backgroundColor: "#2f80ed",
    padding: 10,
    borderRadius: 50,
  },
});