import { UserVO } from "@/utils/parsers";
import { create } from "zustand";

type UserState = {
  user: UserVO | null;
  setUser: (user: UserVO | null) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
