import axiosClient from "@/utils/axios";
import { ReviewVO } from "@/utils/parsers";
import { useQuery } from "@tanstack/react-query";

const fetchReviewsByProductId = async ({ productId, page }: { productId: number; page: number }): Promise<ReviewVO[]> => {
  const { data } = await axiosClient.get(`/products/${productId}/product-reviews`, {
    params: { product_id: productId, page },
  });

  return data.reviews.map((item: any) => new ReviewVO(item)); // Parse each item
};

export const useReviewsByProductIdQuery = (productId: number | undefined, page: number) => {
  return useQuery<ReviewVO[], Error>({
    queryKey: ["reviews", productId, page], // Cache key includes pagination
    queryFn: () => fetchReviewsByProductId({ productId: productId!, page }),
    enabled: !!productId, // Only run if productId exists
  });
};
