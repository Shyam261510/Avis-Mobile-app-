import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { ArrowLeft, LogOut } from "lucide-react-native"; // using Feather for ArrowLeft, LogOut, ChevronDown
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { RootStackParamList } from "../App";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

type ProfileScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const userInfo = useSelector((state: RootState) => state.dataSlice.userInfo);
  const profileInfo = useSelector(
    (state: RootState) => state.dataSlice.profileInfo
  );

  const firstInitial = userInfo.username.charAt(0).toUpperCase();

  const handleBack = () => {
    navigation.push("Home");
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      navigation.push("Login");
      Toast.show({
        type: "success",
        text1: "Logout successfull",
      });
      console.log("Auth token cleared successfully!");
    } catch (error) {
      console.error("Error clearing auth token:", error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.iconBtn}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.iconBtn}>
          <LogOut size={24} color="#f97316" />
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{firstInitial}</Text>
        </View>
        <Text style={styles.userName}>{userInfo.username}</Text>
      </View>

      {/* Input Fields */}
      <View style={styles.form}>
        <Field label="Date of Birth (DOB)" value={profileInfo.DOB} />
        <Field label="GPA" value={profileInfo.GPA} />
        <Field label="Home Country" value={profileInfo.country} />
        <Field label="Destination Country" value={profileInfo.destination} />
        <Field label="Latest Education" value={profileInfo.education} />
        <Field
          label="Field of Interest"
          value={profileInfo.field_of_Interest}
        />
        <Field label="Year of Experience" value={profileInfo.experience} />
        <Field
          label="Budget for Studying Abroad"
          value={profileInfo.budget}
          prefix="₹"
        />
      </View>
    </ScrollView>
  );
}

function Field({
  label,
  value,
  prefix,
}: {
  label: string;
  value: string;
  prefix?: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        {prefix && <Text style={styles.prefix}>{prefix}</Text>}
        <TextInput
          value={value}
          style={[styles.input, prefix && { paddingLeft: 20 }]}
          editable={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 35,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
  },
  iconBtn: {
    padding: 8,
    borderRadius: 999,
  },
  avatarContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  avatar: {
    width: 96,
    height: 96,
    backgroundColor: "#f97316",
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  userName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111827",
  },
  form: {
    paddingHorizontal: 16,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  prefix: {
    marginRight: 4,
    color: "#6b7280",
  },
});
