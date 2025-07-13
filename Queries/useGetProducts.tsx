// hooks/useProductsQuery.ts
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axiosClient from "@/utils/axios";
import { ProductVO } from "@/utils/parsers";

interface ProductsQueryParams {
  orderBy?: string;
  limit?: number;
  sortDirection?: "asc" | "desc";
  page?: number;
  paginate?: boolean;
  category?: string;
  featured?: boolean;
  maxPrice?: number;
}

interface PaginatedResponse {
  products: ProductVO[];
  meta?: {
    total_pages: number;
    current_page: number;
    next_page: number | null;
    prev_page: number | null;
    total_count: number;
  };
}

const fetchProducts = async (params: ProductsQueryParams): Promise<PaginatedResponse> => {
  const { data } = await axiosClient.get("/products", {
    params: {
      order_by: params.orderBy,
      limit: params.limit,
      sort_direction: params.sortDirection,
      page: params.page,
      paginate: params.paginate,
      category: params.category,
      featured: params.featured,
      max_price: params.maxPrice,
    },
  });

  return {
    products: data.products.map((item: any) => new ProductVO(item)),
    meta: data.meta,
  };
};

export const useProductsQuery = (params: ProductsQueryParams = {}, options?: Omit<UseQueryOptions<PaginatedResponse>, "queryKey" | "queryFn">) => {
  const defaultParams = {
    orderBy: "created_at",
    limit: 10,
    sortDirection: "desc" as const,
    paginate: false,
    ...params,
  };

  return useQuery<PaginatedResponse>({
    queryKey: ["products", defaultParams],
    queryFn: () => fetchProducts(defaultParams),
    ...options, // Spread additional options here
  });
};
