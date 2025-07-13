import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserInfo {
  id: string;
  email: string;
  username: string;
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
