import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserInfo {
  id: string;
  email: string;
  username: string;
  botPressUserKey?: string;
  createdAt: Date;
  chat: Chat[];
}

export interface Chat {
  id: string;
  userId: string;
  user: UserInfo;
  messages: Message[];
}

export interface Message {
  id: string;
  userMessage: string;
  botMessages: BotMessage[];
  chatId: string;
  chat: Chat;
}
export interface BotMessage {
  id: string;
  option: string[];
  botResponse: string;
}

const initialState = {
  userInfo: {} as UserInfo,
};

const dataSlice = createSlice({
  name: "dataSlice",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
  },
});
export const { setUserInfo } = dataSlice.actions;

export default dataSlice.reducer;
