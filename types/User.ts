import { Timestamp } from "firebase-admin/firestore";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // hashed password for security
  address: string;
  phone: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}
