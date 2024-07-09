import axiosClient from "@/utils/axios";
import { Review } from "@/types/Review";

export async function getAllReview(): Promise<Review[]> {
  try {
    const response = await axiosClient.get(`/reviews`, {});

    return response.data as Review[];
  } catch (error) {
    console.error("Error fetching new arrival products:", error);
    return [];
  }
}
