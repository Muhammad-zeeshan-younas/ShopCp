// src/api/auth.ts
import axiosClient from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const logoutUser = async (): Promise<void> => {
  await axiosClient.delete("/auth/sign_out");
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      toast.success("You've been logged out successfully");
    },
  });
};
