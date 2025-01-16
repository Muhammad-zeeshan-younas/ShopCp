import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { User } from "@/types/User";

const initialState: User = {
  id: "",
  username: "",
  email: "",
  avatar: "",
  address: "",
  phone: "",
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        id: string;
        username: string;
        email: string;
        avatar?: string; // Make avatar optional
        isLoggedIn?: boolean; // Make isLoggedIn optional
      }>
    ) => {
      const { id, username, email, avatar, isLoggedIn = false } = action.payload;

      return {
        ...state,
        id,
        username,
        email,
        avatar: avatar ?? state.avatar, // Keep previous avatar if no new one is provided
        isLoggedIn,
      };
    },
  },
});

export const { setUser } = userSlice.actions;
export const user = (state: RootState) => state.user;
export default userSlice.reducer;
