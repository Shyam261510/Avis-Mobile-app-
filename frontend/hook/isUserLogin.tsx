import { useEffect } from "react";
import { RootState } from "../store/store";
import { RootStackParamList } from "../App";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";

function isUserLogin() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const userInfo = useSelector((state: RootState) => state.dataSlice.userInfo);

  useEffect(() => {
    if (!userInfo) {
      return navigation.push("Login");
    }
  }, []);
}

export default isUserLogin;
