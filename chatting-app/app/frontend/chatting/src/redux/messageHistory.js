import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
};

export const messagesHistorySlice = createSlice({
  name: "messagesHistory",
  initialState,
  reducers: {
    setMessagesHistory: (state, action) => {
      state.messages = action.payload;
    },
    pushMessageHistory: (state, action) => {
      const newMessages = [...state.messages];
      newMessages.push(action.payload);
      state.messages = newMessages;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setMessagesHistory, pushMessageHistory } =
  messagesHistorySlice.actions;
export const selectMessagesHistory = (state) => state.messagesHistory.messages;

export default messagesHistorySlice.reducer;
