import { Product } from "@/types/Product";
import { User } from "@/types/User";
import axiosClient from "@/utils/axios";
import { headers } from "next/headers";

export async function signupUser({
  username,
  email,
  password,
  file,
}: {
  username: string;
  email: string;
  password: string;
  file: FileList;
}): Promise<User | null> {
  try {
    const response = await axiosClient.post(
      `/user`,
      { username, email, password, avatar: file[0] },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    return null;
  }
}

export async function signinUser({ email, password }: { email: string; password: string }): Promise<User | null> {
  try {
    const response = await axiosClient.post(`/user/sign_in`, { email, password }, { withCredentials: true });
    return response.data.user as User;
  } catch (error) {
    console.error("Error signing in:", error); // Changed to console.error for better visibility
    return null; // Return null in case of an error
  }
}

export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const response = await axiosClient.get(`/products/${productId}`);

    return response.data as Product;
  } catch (error) {
    console.error("Error fetching new arrival products:", error);
    return null;
  }
}
