import axiosClient from "@/utils/axios";
import { ProductVO } from "@/utils/parsers";

export async function getProducts(): Promise<ProductVO[]> {
  try {
    const response = await axiosClient.get(`/products`, {
      params: {
        orderBy: "created_at",
        limit: 10,
        sortDirection: "desc",
      },
    });

    return response.data.map((item: any) => new ProductVO(item));
  } catch (error) {
    console.error("Error fetching new arrival products:", error);
    return [];
  }
}

export async function getProductById(
  productId: string
): Promise<ProductVO | null> {
  try {
    const response = await axiosClient.get(`/products/${productId}`);

    return response.data as ProductVO;
  } catch (error) {
    console.error("Error fetching new arrival products:", error);
    return null;
  }
}
