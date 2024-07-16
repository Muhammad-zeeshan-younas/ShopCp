import { DocumentReference, Timestamp } from "firebase-admin/firestore";
import { Review } from "./Review";
import { Moment } from "moment-timezone";

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image_url: string;
  stock: number;
  created_at: Moment;
  stock_quantity: number;
  updated_at: Moment;
  sales_count: number;
  reviews?: Review[];
  sku: string;
};
