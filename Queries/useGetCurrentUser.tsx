// src/api/user.ts
import axiosClient from "@/utils/axios";
import { UserVO } from "@/utils/parsers";
import { useUserStore } from "@/Zustand/store/user.store";
import { useQuery } from "@tanstack/react-query";

const fetchCurrentUser = async (): Promise<UserVO> => {
  try {
    const { data } = await axiosClient.get("/user");

    return new UserVO(data);
  } catch (error) {
    // Convert API errors to meaningful messages
    throw new Error("Failed to fetch user data");
  }
};

export const useCurrentUser = (token: string | null) => {
  return useQuery<UserVO, Error>({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    retry: 1,
    enabled: !!token,
  });
};
