import { DocumentReference, Timestamp } from "firebase-admin/firestore";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
  created_at: Timestamp;
  updated_at: Timestamp;
  reviews?: DocumentReference[];
}
