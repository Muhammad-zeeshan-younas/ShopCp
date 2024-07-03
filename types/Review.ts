import { DocumentReference, Timestamp } from "firebase-admin/firestore";

export interface Review {
  id: string;
  reviewer: DocumentReference;
  rating: number;
  comment: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}
