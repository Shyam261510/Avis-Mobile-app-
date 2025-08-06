import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Bell, FileText, ChevronRight } from "lucide-react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import Navbar from "../componets/Navbar";
import { useUserLoginRedirect } from "../hook/useUserLoginRedirect";

const HomeScreen = () => {
  const isLoggedIn = useUserLoginRedirect();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const userInfo = useSelector((state: RootState) => state.dataSlice.userInfo);
  const profileInfo = useSelector(
    (state: RootState) => state.dataSlice.profileInfo
  );
  console.log(profileInfo);
  useEffect(() => {
    if (!profileInfo) {
      navigation.push("ProfileSetup");
      return;
    }
  }, []);
  if (!isLoggedIn) {
    navigation.replace("Login");
    return null;
  }
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AVIS</Text>
          <TouchableOpacity>
            <Bell size={24} color="#1d130c" />
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <Text style={styles.greeting}>Hi, {userInfo.username} </Text>

        {/* Application Status */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Chat")}
        >
          <View style={styles.cardLeft}>
            <View style={styles.iconBox}>
              <FileText size={24} color="#1d130c" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Application Status</Text>
              <Text style={styles.cardSubtitle}>Continue Chat</Text>
            </View>
          </View>
          <ChevronRight size={24} color="#1d130c" />
        </TouchableOpacity>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <View style={styles.cardLeft}>
            <View style={styles.iconBox}>
              <FileText size={24} color="#1d130c" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Application Update</Text>
              <Text style={styles.cardSubtitle}>
                Your application is in progress
              </Text>
            </View>
          </View>
          <ChevronRight size={24} color="#1d130c" />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcf9f8",
    marginTop: 50,
  },
  content: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    padding: 16,
    paddingBottom: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C120D",
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    color: "#1C120D",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    color: "#1d130c",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    backgroundColor: "#f4ece6",
    borderRadius: 8,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    color: "#1d130c",
    fontSize: 16,
    fontWeight: "500",
  },
  cardSubtitle: {
    color: "#a16a45",
    fontSize: 13,
    marginTop: 2,
  },
  tag: {
    backgroundColor: "#f4ece6",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 8,
  },
});

export default HomeScreen;
