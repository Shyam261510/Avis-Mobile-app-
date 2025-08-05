import React, { useEffect, useRef, useState, useTransition } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList as FlatListType,
} from "react-native";
import { Bot, User, Send } from "lucide-react-native";
import uuid from "react-native-uuid";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import { RootState } from "../store/store";
import BotLoader from "../componets/BotLoader";
import { setIsFetch } from "../store/dataSlice";
import { RootStackParamList } from "../App";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import isUserLogin from "../hook/isUserLogin";

type Message = {
  id: string;
  sender: "bot" | "user";
  content: string;
  options?: string[];
};

const setupQuestions = [
  {
    id: "DOB",
    content: "😊 What's your date of birth? 🎂🗓️",
  },
  {
    id: "country",
    content: "🏠 Which country are you currently living in?",
  },
  {
    id: "destination",
    content: "✈️ Which country do you want to go to?",
    options: ["Germany", "U.K", "Canda", "Other"],
  },
  {
    id: "field_of_Interest",
    content:
      "🤔What course or field are you most interested in studying abroad?",
  },
  {
    id: "education",
    content:
      "What's your most recent qualification, and when did you complete it? 🏫📅",
  },

  {
    id: "GPA",
    content:
      "What was your final grade or GPA in your most recent education? 📊✅",
  },
  {
    id: "experience",
    content: "Do you have any work experience? If yes, how long? 💼⏳",
  },
  {
    id: "budget",
    content: "What’s your expected budget for studying abroad? 💰✈️",
  },
];

type ProfileSetupScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const ChatbotAvatar = () => (
  <View style={styles.avatarBubble}>
    <Bot size={18} color="#fcf9f8" />
  </View>
);

const UserAvatar = () => (
  <View style={styles.avatarBubble}>
    <User size={18} color="#fcf9f8" />
  </View>
);

export default function ProfileSetup() {
  isUserLogin();
  const navigation = useNavigation<ProfileSetupScreenNavigationProp>();
  const dispatch = useDispatch();

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
    },
  ]);

  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const scrollViewRef = useRef<FlatListType<any>>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const userInfo = useSelector((state: RootState) => state.dataSlice.userInfo);

  const handleSend = () => {
    if (input.trim() === "") return;

    startTransition(async () => {
      const newMessages = {
        id: uuid.v4(),
        sender: "user",
        content: input,
      } as Message;

      const newAnswers = {
        ...answers,
        [setupQuestions[step].id]: input,
      };

      setMessages((prev) => [...prev, newMessages]);
      setAnswers(newAnswers);
      setInput("");

      try {
        if (Object.keys(newAnswers).length === setupQuestions.length) {
          const {
            DOB,
            country,
            destination,
            field_of_Interest,
            education,
            GPA,
            experience,
            budget,
          } = newAnswers;

          const res = await axios.post(
            `${process.env.API_URL}/api/create-profile`,
            {
              userId: userInfo.id,
              DOB,
              country,
              destination,
              field_of_Interest,
              education,
              GPA,
              experience,
              budget,
            }
          );

          const { success, message } = res.data;

          if (!success) {
            Toast.show({
              type: "error",
              text1: message || "Profile creation failed.",
            });
            return;
          }

          Toast.show({
            type: "success",
            text1: message || "Profile created successfully!",
          });

          dispatch(setIsFetch());
          navigation.push("Home");
          return;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: uuid.v4(),
            sender: "bot",
            content: setupQuestions[step + 1].content,
            options: setupQuestions[step + 1].options,
          },
        ]);

        setStep((prev) => prev + 1);
      } catch (error: any) {
        console.error("Error submitting profile data:", error.message);
        Toast.show({
          type: "error",
          text1: "Something went wrong!",
          text2:
            error?.response?.data?.message || error.message || "Unknown error",
        });
      }
    });
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  if (isPending) {
    return (
      <View style={{ flex: 1, paddingTop: 50, paddingHorizontal: 16 }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <BotLoader variant="dots" />
        </View>
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.container}>
        {/* Header */}

        <Text style={styles.headerTitle}>AVIS Assistant</Text>

        {/* Chat Messages */}
        <ScrollView contentContainerStyle={styles.chatContainer}>
          {messages.map((messageInfo: Message) => (
            <View key={messageInfo.id}>
              {/* Assistant message */}
              {messageInfo.sender === "bot" ? (
                <View style={styles.messageRow}>
                  <ChatbotAvatar />

                  <View style={styles.messageBubbleLeft}>
                    <Text style={styles.sender}>AVIS Assistant</Text>

                    <Text style={styles.messageTextLeft}>
                      {messageInfo.content}
                    </Text>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        gap: 10,
                        marginTop: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      {messageInfo.options?.map((value: string, index) => (
                        <Text
                          key={index}
                          style={{
                            borderWidth: 1,
                            padding: 4,
                            borderRadius: 5,
                          }}
                          onPress={() => {
                            setInput(value);
                          }}
                        >
                          {value}
                        </Text>
                      ))}
                    </View>
                  </View>
                </View>
              ) : (
                // User message
                <View
                  style={[styles.messageRow, { justifyContent: "flex-end" }]}
                >
                  <View style={styles.messageBubbleRight}>
                    <Text style={styles.messageTextRight}>
                      {messageInfo.content}
                    </Text>
                  </View>
                  <UserAvatar />
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <UserAvatar />
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Type a message..."
              placeholderTextColor="#a16a45"
              style={styles.textInput}
              value={input}
              onChangeText={(value) => setInput(value)}
            />

            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.sendText}>
                <Send color="#FFFFFF" />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffaf5",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1d130c",
    textAlign: "center",
    marginBottom: 12,
  },
  chatContainer: {
    paddingBottom: 80,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  avatarBubble: {
    backgroundColor: "#FF5F15",
    borderRadius: 20,
    padding: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  messageBubbleLeft: {
    marginLeft: 8,
    maxWidth: "75%",
    backgroundColor: "#f4ece6",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  messageBubbleRight: {
    marginRight: 8,
    maxWidth: "75%",
    backgroundColor: "#ff6600",
    borderRadius: 12,
    padding: 12,
    alignItems: "flex-end",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  sender: {
    fontSize: 13,
    color: "#a16a45",
    marginBottom: 4,
  },
  messageTextLeft: {
    color: "#1d130c",
    fontSize: 16,
  },
  messageTextRight: {
    color: "#fcf9f8",
    fontSize: 16,
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fffaf5",
    borderTopWidth: 1,
    borderColor: "#e0d6d0",
  },
  inputBox: {
    flexDirection: "row",
    backgroundColor: "#f4ece6",
    borderRadius: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    flex: 1,
    height: 48,
  },
  textInput: {
    flex: 1,
    color: "#1d130c",
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#ff6600",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
  },
  sendText: {
    color: "#fcf9f8",
    fontWeight: "600",
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0d6d0",
    marginTop: 6,
    marginRight: 8,
  },
  optionText: {
    fontSize: 14,
    color: "#a16a45",
  },
});
