import { Product } from "@/types/Product";
import axiosClient from "@/utils/axios";

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await axiosClient.get(`/products`, {
      params: {
        orderBy: "created_at",
        limit: 10,
        sortDirection: "desc",
      },
    });

    return response.data as Product[];
  } catch (error) {
    console.error("Error fetching new arrival products:", error);
    return [];
  }
}

export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const response = await axiosClient.get(`/products/${productId}`);

    return response.data as Product;
  } catch (error) {
    console.error("Error fetching new arrival products:", error);
    return null;
  }
}
