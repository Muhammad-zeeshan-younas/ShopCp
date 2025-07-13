import axiosClient from "@/utils/axios";
import { ReviewVO } from "@/utils/parsers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const createReview = async (reviewData: Partial<ReviewVO>): Promise<ReviewVO> => {
  const { data } = await axiosClient.post(`/reviews`, reviewData);
  return new ReviewVO(data);
};

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ReviewVO, Error, Partial<ReviewVO>>({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] }); // Refetch after creation
    },
    onError: (error) => {
      console.error("Error creating review:", error);
      toast.error("Failed to submit review");
    },
  });
};
