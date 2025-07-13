// hooks/useProductByIdQuery.ts
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/utils/axios";
import { ProductVO } from "@/utils/parsers";

const fetchProductById = async (productId: string): Promise<ProductVO> => {
  const { data } = await axiosClient.get(`/products/${productId}`);
  return new ProductVO(data);
};

export const useProductByIdQuery = (productId: string) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId),
    enabled: !!productId,
  });
};
