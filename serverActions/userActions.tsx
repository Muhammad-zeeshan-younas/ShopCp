import axiosClient from "@/utils/axios";
import { ProductVO, UserVO } from "@/utils/parsers";

async function signupUser({
  username,
  email,
  password,
  file,
}: {
  username: string;
  email: string;
  password: string;
  file: FileList;
}): Promise<UserVO | null> {
  try {
    const response = await axiosClient.post(
      `/auth`,
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

const getUser = async () => {
  const response = await axiosClient.get("/user");
  return new UserVO(response.data);
};

async function signinUser({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<UserVO | null> {
  try {
    const response = await axiosClient.post(
      `/auth/sign_in`,
      { email, password },
      { withCredentials: true }
    );
    return response.data.user as UserVO;
  } catch (error) {
    console.error("Error signing in:", error); // Changed to console.error for better visibility
    return null; // Return null in case of an error
  }
}
const logout = async () => {
  return axiosClient.delete("/auth/sign_out");
};

async function getProductById(productId: string): Promise<ProductVO | null> {
  try {
    const response = await axiosClient.get(`/products/${productId}`);

    return response.data as ProductVO;
  } catch (error) {
    console.error("Error fetching new arrival products:", error);
    return null;
  }
}
export { getUser, signinUser, signupUser, getProductById, logout };
