import axiosClient from "@/utils/axios";
import { ReviewVO } from "@/utils/parsers";

export async function getAllReview(): Promise<ReviewVO[]> {
  try {
    const response = await axiosClient.get(`/reviews`);

    return response.data as ReviewVO[];
  } catch (error) {
    console.error("Error fetching new arrival products:", error);
    return [];
  }
}

export async function createReview(): Promise<ReviewVO[]> {
  try {
    const response = await axiosClient.get(`/reviews`);

    return response.data as ReviewVO[];
  } catch (error) {
    console.error("Error fetching new arrival products:", error);
    return [];
  }
}

export async function getAllReviewsByProductId({
  productId,
  page,
}: {
  productId: number | undefined;
  page: number;
}): Promise<ReviewVO[] | undefined> {
  try {
    const response = await axiosClient.get(
      `/products/${productId}/product-reviews`,
      {
        params: { product_id: productId, page: page },
      }
    );

    return response.data as ReviewVO[];
  } catch (error) {
    console.error("Error fetching reviews by product ID:", error);
    return undefined;
  }
}
