import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/utils/axios";
import { ReviewVO } from "@/utils/parsers";

const fetchAllReviews = async (): Promise<ReviewVO[]> => {
  const { data } = await axiosClient.get(`/reviews`);
  return data.map((item: any) => new ReviewVO(item)); // Ensure parsing
};

export const useAllReviewsQuery = () => {
  return useQuery<ReviewVO[], Error>({
    queryKey: ["reviews"],
    queryFn: fetchAllReviews,
  });
};
