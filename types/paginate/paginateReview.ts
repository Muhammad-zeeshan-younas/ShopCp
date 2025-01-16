import { Moment } from "moment-timezone";
import { Review } from "../Review";

export type PaginateReview = {
  reviews: Review[];
  current_page: number;
  total_pages: number;
  total_count: number;
  hasMore?:boolean
};
