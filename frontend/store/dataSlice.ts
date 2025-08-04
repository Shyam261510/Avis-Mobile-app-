import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserInfo {
  id: string;
  email: string;
  username: string;
  botPressUserKey?: string;
  createdAt: Date;
  profileInfo: ProfileSetup;
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

export interface Document {
  id: string;
  fileName: string;
  size: number;
  uri: string;
  documentTitle: string;
}
export interface ProfileSetup {
  id: string;
  DOB: string;
  country: string;
  destination: string;
  field_of_Interest: string;
  education: string;
  GPA: string;
  experience: string;
  budget: string;
}

const initialState = {
  userInfo: {} as UserInfo,
  isFetch: false as boolean,
  document: [] as Document[],
};

const dataSlice = createSlice({
  name: "dataSlice",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
    setIsFetch: (state) => {
      state.isFetch = !state.isFetch;
    },
    setDocuments: (state, action: PayloadAction<Document[]>) => {
      state.document = action.payload;
    },
  },
});
export const { setUserInfo, setIsFetch, setDocuments } = dataSlice.actions;

export default dataSlice.reducer;
