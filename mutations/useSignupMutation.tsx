// src/api/auth.ts
import axiosClient from "@/utils/axios";
import { UserVO } from "@/utils/parsers";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface SignupCredentials {
  email: string;
  username: string;
  avatar: File;
  phone: string;
  address: string;
  password: string;
}

const signUp = async (credentials: SignupCredentials): Promise<UserVO> => {
  console.log(credentials);
  const response = await axiosClient.post(
    "/auth",
    {
      ...credentials, // Match your API expected format
    },
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data", // Important for file upload
      },
    }
  );
  return response.data;
};

export const useSignUpMutation = () => {
  return useMutation<UserVO, Error, SignupCredentials>({
    mutationFn: signUp,
    onSuccess: (data) => {
      toast.success("Welcome back!");
    },
    onError: (error: any) => {},
  });
};
