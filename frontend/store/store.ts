import { configureStore } from "@reduxjs/toolkit";
import dataSlice from "./dataSlice";

export const store = configureStore({
  reducer: {
    dataSlice,
  },
});

// Types for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
