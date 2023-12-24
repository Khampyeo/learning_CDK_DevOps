import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user";
import messagesHistoryReducer from "./messageHistory";

export const store = configureStore({
  reducer: {
    user: userReducer,
    messagesHistory: messagesHistoryReducer,
  },
});
