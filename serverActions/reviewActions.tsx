import axiosClient from "@/utils/axios";
import { Review } from "@/types/Review";
import { PaginateReview } from "@/types/paginate/paginateReview";

export async function getAllReview(): Promise<Review[]> {
  try {
    const response = await axiosClient.get(`/reviews`);

    return response.data as Review[];
  } catch (error) {
    console.error("Error fetching new arrival products:", error);
    return [];
  }
}

export async function getAllReviewsByProductId({
  productId,
  page,
}: {
  productId: string | undefined;
  page: number;
}): Promise<PaginateReview | undefined> {
  try {
    const response = await axiosClient.get(`/products/${productId}/product-reviews`, {
      params: { product_id: productId, page: page },
    });
    console.log(response)
    return response.data as PaginateReview;
  } catch (error) {
    console.error("Error fetching reviews by product ID:", error);
    return undefined;
  }
}
