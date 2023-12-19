import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserName } = userSlice.actions;
export const selectUserName = (state) => state.user.userName;

export default userSlice.reducer;
