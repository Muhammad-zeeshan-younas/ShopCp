import { Timestamp } from "firebase-admin/firestore";

export type User = {
  id: string;
  username: string;
  email: string;
  password?: string; // hashed password for security
  address: string;
  phone: string;
  avatar?: string | undefined;
  created_at?: Timestamp;
  updated_at?: Timestamp;
  isLoggedIn: boolean;
};
