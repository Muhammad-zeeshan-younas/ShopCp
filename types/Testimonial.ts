import { DocumentReference, Timestamp } from "firebase-admin/firestore";

export interface Testimonial {
  id: string;
  user: DocumentReference;
  text: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}
