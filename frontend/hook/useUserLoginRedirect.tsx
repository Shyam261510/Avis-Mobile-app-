import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { RootStackParamList } from "../App";
import { RootState } from "../store/store";

export function useUserLoginRedirect() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const userInfo = useSelector((state: RootState) => state.dataSlice.userInfo);

  useEffect(() => {
    if (!userInfo) {
      navigation.replace("Login");
    }
  }, [userInfo, navigation]);

  return !!userInfo; // true if logged in, false otherwise
}
