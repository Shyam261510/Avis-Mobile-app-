import React, { useState, useTransition } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import PasswordInput from "../componets/PasswordInput";
import axios from "axios";
import Toast from "react-native-toast-message";
import Spinner from "../componets/Spinner";
export default function SignUp() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [isPending, startTransition] = useTransition();

  function signupHandler() {
    const { username, email, password, phone } = formData;

    startTransition(async () => {
      try {
        const res = await axios.post(`${process.env.API_URL}/api/signup`, {
          username: String(username).trim(),
          email: String(email).trim(),
          password: String(password).trim(),
          phone,
        });

        const { success, message, user } = res.data;

        if (!success) {
          Toast.show({
            type: "error",
            text1: message,
          });
          return;
        }

        Toast.show({
          type: "success",
          text1: message,
        });

        navigation.navigate("Login");
      } catch (error: any) {
        Toast.show({
          type: "error",
          text1: "Signup failed",
          text2: error.response?.data?.message || error.message,
        });
      }
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Content */}
      <View style={styles.content}>
        <View style={styles.innerContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to AVIS</Text>
            <Text style={styles.subtitle}>Sign up to start your journey</Text>
          </View>

          {/* Input Fields */}
          <View style={styles.inputSection}>
            <TextInput
              placeholder="Username"
              placeholderTextColor="#6B7280"
              style={styles.input}
              value={formData.username}
              onChangeText={(value) =>
                setFormData((prev) => ({ ...prev, username: value }))
              }
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#6B7280"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={formData.email}
              onChangeText={(value) =>
                setFormData((prev) => ({ ...prev, email: value }))
              }
            />
            <TextInput
              placeholder="Phone"
              placeholderTextColor="#6B7280"
              style={styles.input}
              keyboardType="numeric" // shows numeric keypad
              maxLength={10}
              value={formData.phone}
              onChangeText={(value) =>
                setFormData((prev) => ({ ...prev, phone: value }))
              }
            />

            <PasswordInput
              value={formData.password}
              onChangeText={(value: any) =>
                setFormData((prev) => ({ ...prev, password: value }))
              }
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={styles.emailButton}
              disabled={isPending}
              onPress={signupHandler}
            >
              {isPending ? (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    gap: 10,
                    justifyContent: "center",
                    alignContent: "center",
                    marginTop: 12,
                  }}
                >
                  <Spinner />
                  <Text style={styles.emailButtonText}>
                    Creating Account...
                  </Text>
                </View>
              ) : (
                <Text style={styles.emailButtonText}>Create account</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.googleButtonText}>
                All Ready have account? Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7ED", // orange-50
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  innerContent: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
  },
  inputSection: {
    marginBottom: 24,
  },
  input: {
    height: 48,
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111827",
    marginBottom: 16,
  },
  buttonSection: {
    gap: 12,
  },
  emailButton: {
    backgroundColor: "#F97316",
    height: 48,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  emailButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  googleButton: {
    backgroundColor: "#F3F4F6",
    height: 48,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  googleIcon: {
    marginRight: 8,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
});
