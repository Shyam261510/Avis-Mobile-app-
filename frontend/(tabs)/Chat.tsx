import React, { useEffect, useState, useTransition } from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { RootStackParamList } from "../App";
import axios from "axios";
import {
  BotMessage,
  UserInfo,
  Chat as ChatType,
  Message,
} from "../store/dataSlice";

const Chat = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const userInfo = useSelector((state: RootState) => state.dataSlice.userInfo);

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const getMessage = () => {
    startTransition(async () => {
      const res = await axios.get(
        `${process.env.API_URL}/api/getMessages?userId=${userInfo.id}`
      );

      // setMessages(updatedMessages);
    });
  };

  useEffect(() => {
    getMessage();
  }, []);
  async function sendMessage() {
    try {
      await axios.post(`${process.env.API_URL}/api/createMessage`, {
        userId: userInfo.id,
        message,
        botPressUserKey: userInfo.botPressUserKey,
      });

      getMessage();
    } catch (error: any) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message || error
      );
    }
  }

  async function handelSend() {
    setMessages((prev: Message[]) => [
      ...prev,
      {
        id: new Date().toLocaleString(),
        userMessage: message as string,
        botMessages: [
          {
            id: new Date().toLocaleString(),
            option: [],
            botResponse: "typing...",
          },
        ],
        chatId: new Date().toLocaleString(),
        options: [],
        chat: {} as ChatType,
      },
    ]);
    setMessage("");
    await sendMessage();
  }
  if (isPending) {
    return (
      <View>
        <Text>Loading..</Text>
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
        <TouchableOpacity
          style={styles.header}
          onPress={() => navigation.navigate("Home")}
        >
          <ArrowLeft color="#1d130c" size={24} />
          <Text style={styles.headerTitle}>AVIS Assistant</Text>
          <View style={{ width: 24 }} />
        </TouchableOpacity>

        {/* Chat Messages */}
        <ScrollView contentContainerStyle={styles.chatContainer}>
          {/* Assistant message */}
          {messages.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 250,
              }}
            >
              <Text style={{ fontSize: 22 }}>No conversation start yet</Text>
            </View>
          ) : (
            messages.map((messageInfo: Message) => (
              <View key={messageInfo.id}>
                <View style={styles.messageRow}>
                  <ImageBackground
                    source={{
                      uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnpUDZHXeGpF4ZhnOa4ldq7nSzkzMTZKXqV0z93win-m-r5lwkybP2Zy1A5s8aqRRxAw4nZfbDL_VNOdwIEIPEelZ9K9UWrLQ3XzQhuEi_3ezH-F-JcKQoRn7sYtmNsrHC0FBsjVeog2GD92XktPWYiQCLqMRfpMZkoykNpZY34YK18TglVBC1QfelBpMRmOGwfQfMeGJWcf_6shTucX9X6hA6T55_7JEvgmG2OE0rmoYN8mP1I3g-omhF7DA6uoRD6L9c6dCj_5PC",
                    }}
                    style={styles.avatar}
                    imageStyle={{ borderRadius: 20 }}
                  />

                  <View style={styles.messageBubbleLeft}>
                    <Text style={styles.sender}>AVIS Assistant</Text>

                    <Text style={styles.messageTextLeft}>
                      {messageInfo.botMessages[0].botResponse}
                    </Text>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        gap: 10,
                        marginTop: 12,
                      }}
                    >
                      {messageInfo.botMessages[0].option.map(
                        (value: string, index) => (
                          <Text
                            key={index}
                            style={{
                              borderWidth: 1,
                              padding: 4,
                              borderRadius: 5,
                            }}
                          >
                            {value}
                          </Text>
                        )
                      )}
                    </View>
                  </View>
                </View>

                {/* User message */}
                <View
                  style={[styles.messageRow, { justifyContent: "flex-end" }]}
                >
                  <View style={styles.messageBubbleRight}>
                    <Text style={styles.sender}>{userInfo.username}</Text>

                    <Text style={styles.messageTextRight}>
                      {messageInfo.userMessage}
                    </Text>
                  </View>
                  <ImageBackground
                    source={{
                      uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnT0eUton2bphDNZkQtx94HJGZAtsLo543ImA740oOIRCA3S5CdImDGWqxOLs8c4SUKQ_J7601Rx5Xh-rKi5zrHO18aGBB3r64khEx3rE5A0NpOzTvqVJR-WnZ3YQeCSdtwjgNylVA8U01lxUXUNTFIV_YES3kWaklgwLRRpPJpIQH1AOukqrk6471lDwp0ET13u4f8vz4ispc5WfovLoytIB-7Kk8qEciN1ao50R2gRh_l8y5uwM9gzyrFmY75Aj5aFAOlvlhz4z5",
                    }}
                    style={styles.avatar}
                    imageStyle={{ borderRadius: 20 }}
                  />
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <ImageBackground
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiNomBPA2sm0-tmLMJPerPesPze2HkCd7gMhP4LSxRK-_6df2IwH6z-QHsussS1kjZyMYNlhP4UbNT4bvL2KDgOhie3bh59Q1KXEfxVOuAAlezjmJNlCqCtW7_ISoHYMWuOgAMZPTTC1_REo63g5hrMSLL8si2GUlNbugbkro1LHCqux6tRcJvrYyYYoEBscMY3urjHS7QH2A5DghnKPo0a5mJrNZHCJqPCN0P3Y3jzrORVnKtJNYc3N1ommPLCDJZnIo3nWpa-6sZ",
            }}
            style={styles.avatar}
            imageStyle={{ borderRadius: 20 }}
          />
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Type a message..."
              placeholderTextColor="#a16a45"
              style={styles.textInput}
              value={message}
              onChangeText={(value) => setMessage(value)}
            />

            <TouchableOpacity style={styles.sendButton} onPress={handelSend}>
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcf9f8",
    marginTop: 50,
  },
  header: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1d130c",
    textAlign: "center",
    flex: 1,
  },
  chatContainer: {
    padding: 16,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
  },
  messageBubbleLeft: {
    marginLeft: 8,
    maxWidth: "75%",
  },
  messageBubbleRight: {
    marginRight: 8,
    maxWidth: "75%",
    alignItems: "flex-end",
  },
  sender: {
    fontSize: 13,
    color: "#a16a45",
  },
  messageTextLeft: {
    marginTop: 4,
    backgroundColor: "#f4ece6",
    borderRadius: 12,
    padding: 12,
    color: "#1d130c",
    fontSize: 16,
  },
  messageTextRight: {
    marginTop: 4,
    backgroundColor: "#ff6600",
    borderRadius: 12,
    padding: 12,
    color: "#fcf9f8",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 8,
  },
  inputBox: {
    flexDirection: "row",
    backgroundColor: "#f4ece6",
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    flex: 1,
    height: 48,
    gap: 8,
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
  },
  sendText: {
    color: "#fcf9f8",
    fontWeight: "500",
  },
});
