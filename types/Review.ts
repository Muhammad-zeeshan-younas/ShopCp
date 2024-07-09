import { Moment } from "moment-timezone";
import { User } from "./User";

export type Review = {
  id: string;
  user: User;
  rating: number;
  comment: string;
  created_at: Moment;
  updated_at: Moment;
};
