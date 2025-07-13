import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Home, MessageCircleMore, User, FileText } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

const Navbar = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.navbar}>
      <NavItem
        label="Home"
        icon={<Home size={24} color="#1d130c" />}
        active
        onNavigate={() => navigation.navigate("Home")}
      />
      <NavItem
        label="Chat"
        icon={<MessageCircleMore size={24} color="#a16a45" />}
        active={false}
        onNavigate={() => navigation.navigate("Chat")}
      />
      <NavItem
        label="Documents"
        icon={<FileText size={24} color="#a16a45" />}
        active={false}
        onNavigate={() => navigation.navigate("documentScreen")}
      />
      <NavItem
        label="Profile"
        icon={<User size={24} color="#a16a45" />}
        active={false}
        onNavigate={() => navigation.navigate("ProfileScreen")}
      />
    </View>
  );
};

export default Navbar;

const NavItem = ({
  icon,
  label,
  active = false,
  onNavigate,
}: {
  icon: any;
  label: string;
  active: boolean;
  onNavigate: () => void;
}) => (
  <TouchableOpacity style={styles.navItem} onPress={onNavigate}>
    {icon}
    <Text style={[styles.navText, active && { color: "#1d130c" }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#f4ece6",
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "#fcf9f8",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#a16a45",
    marginTop: 4,
  },
});
