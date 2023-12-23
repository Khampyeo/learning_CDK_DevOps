import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user";
import messagesReducer from "./messageHistory";

export const store = configureStore({
  reducer: {
    user: userReducer,
    message: messagesReducer,
  },
});
