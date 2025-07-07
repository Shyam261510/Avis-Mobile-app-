import React from "react";
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
export default function LoginScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView style={styles.container}>
      {/* Content */}
      <View style={styles.content}>
        <View style={styles.innerContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome back to AVIS</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your application
            </Text>
          </View>

          {/* Input Fields */}
          <View style={styles.inputSection}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#6B7280"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <PasswordInput />
          </View>

          {/* Buttons */}
          <View style={styles.buttonSection}>
            <TouchableOpacity style={styles.emailButton}>
              <Text style={styles.emailButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={() => navigation.navigate("SignUp")}
            >
              <Text style={styles.googleButtonText}>Create an account</Text>
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
