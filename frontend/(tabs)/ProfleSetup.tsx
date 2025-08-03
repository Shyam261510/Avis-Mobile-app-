import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  FlatList as FlatListType,
} from "react-native";
import { Bot, User, Send } from "lucide-react-native";
import uuid from "react-native-uuid";

type Message = {
  id: string;
  sender: "bot" | "user";
  content: string;
  options?: string[];
};

const setupQuestions = [
  {
    id: "language",
    content: "🌍 What is your preferred language?",
    options: ["English", "Spanish", "French", "German", "Portuguese", "Other"],
  },
  {
    id: "country",
    content: "🏠 Which country are you currently living in?",
  },
  {
    id: "destination",
    content: "✈️ Which country do you want to go to?",
  },
  {
    id: "reason",
    content: "🤔 Why do you want to go there?",
  },
  {
    id: "passion",
    content: "💡 What motivates or drives your decision?",
  },
];

const ChatbotAvatar = () => (
  <View style={styles.avatarBubble}>
    <Bot size={18} color="#fff" />
  </View>
);

const UserAvatar = () => (
  <View style={[styles.avatarBubble, { backgroundColor: "#6EE7B7" }]}>
    <User size={18} color="#000" />
  </View>
);

export default function ProfileSetup() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuid.v4(),
      sender: "bot",
      content:
        "👋 Hey there! I’m your AVIS 🤖. Let’s personalize your experience. I’m taking notes, so answer honestly!",
    },
    {
      id: uuid.v4(),
      sender: "bot",
      content: setupQuestions[0].content,
      options: setupQuestions[0].options,
    },
  ]);

  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const scrollViewRef = useRef<FlatListType<any>>(null); // ✅ Type the FlatList ref
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSend = () => {
    if (input.trim() === "") return;

    const newMessages = {
      id: uuid.v4(),
      sender: "user",
      content: input,
    } as Message;

    const newAnswers = {
      ...answers,
      [setupQuestions[step].id]: input,
    };
    console.log(newAnswers);

    setMessages((prev) => [...prev, newMessages]);
    setAnswers(newAnswers);
    setInput("");

    setTimeout(() => {
      if (step + 1 < setupQuestions.length) {
        setMessages((prev) => [
          ...prev,
          {
            id: uuid.v4(),
            sender: "bot",
            content: setupQuestions[step + 1].content,
          },
        ]);
        setStep(step + 1);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: uuid.v4().toString(),
            sender: "bot" as const,
            content: "✅ Great! You're all set. Here's a quick summary:",
          },
          ...Object.entries(newAnswers).map(([key, value]) => ({
            id: uuid.v4().toString(),
            sender: "bot" as const,
            content: `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`,
          })),
        ]);
      }
    }, 500);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <FlatList
          ref={scrollViewRef}
          data={messages}
          keyExtractor={(item) => item.id as string}
          renderItem={({ item }: { item: Message }) => (
            <View
              style={[
                styles.messageContainer,
                item.sender === "user" && { justifyContent: "flex-end" },
              ]}
            >
              {item.sender === "bot" ? <ChatbotAvatar /> : <UserAvatar />}

              <View
                style={[
                  styles.messageBubble,
                  item.sender === "user" ? styles.userBubble : styles.botBubble,
                ]}
              >
                <Text
                  style={{
                    color: item.sender === "user" ? "#000" : "#fff",
                  }}
                >
                  {item.content}
                  <View style={{ flex: 1, flexDirection: "row", gap: 12 }}>
                    {item.options?.map((val, index) => (
                      <View
                        key={index}
                        style={{
                          paddingVertical: 1,
                          paddingHorizontal: 10,
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "white",
                          borderColor: "#FF5F15",
                          flexWrap: "wrap",
                        }}
                      >
                        <Text
                          style={{ color: "#FF5F15" }}
                          onPress={() => setInput(val)}
                        >
                          {val}
                        </Text>
                      </View>
                    ))}
                  </View>
                </Text>
              </View>
            </View>
          )}
        />

        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type your answer..."
            style={styles.input}
          />
          <TouchableOpacity
            onPress={handleSend}
            style={styles.sendButton}
            disabled={!input.trim()}
          >
            <Send size={20} color="#FF5F15" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: "#fcf9f8",
    marginTop: 50,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 12,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 12,
    marginLeft: 8,
    marginRight: 8,
  },
  botBubble: {
    backgroundColor: "#FF5F15",
    borderTopLeftRadius: 0,
  },
  userBubble: {
    backgroundColor: "#D1FAE5",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  avatarBubble: {
    backgroundColor: "#FF5F15",
    borderRadius: 20,
    padding: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginRight: 8,
  },
  sendButton: {
    padding: 8,
    borderRadius: 10,
  },
});
