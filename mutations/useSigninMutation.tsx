// src/api/auth.ts
import axiosClient from "@/utils/axios";
import { UserVO } from "@/utils/parsers";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface SignInCredentials {
  email: string;
  password: string;
}

const signInUser = async (credentials: SignInCredentials): Promise<UserVO> => {
  const response = await axiosClient.post(
    "/auth/sign_in",
    {
      ...credentials, // Match your API expected format
    },
    { withCredentials: true }
  );
  return response.data;
};

export const useSignInMutation = () => {
  return useMutation<UserVO, Error, SignInCredentials>({
    mutationFn: signInUser,
    onSuccess: (data) => {
      toast.success("Welcome back!");
    },
    onError: (error: any) => {},
  });
};
