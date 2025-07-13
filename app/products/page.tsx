// app/products/page.tsx
"use client"; // Mark as Client Component since we're using hooks

import { ProductFilters } from "@/components/Filters/ProductFilter";
import { Pagination } from "@/components/Pagination/Pagination";
import { ProductListSkeleton } from "@/components/Skeletons/ProductSkeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductVO } from "@/utils/parsers";
import { Badge } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useProductsQuery } from "@/Queries";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || undefined;
  const price_min = searchParams.get("price_min") || undefined;
  const price_max = searchParams.get("price_max") || undefined;
  const sort = searchParams.get("sort") as "price_asc" | "price_desc" | "newest" | undefined;
  const router = useRouter();
  const { data, isLoading } = useProductsQuery({
    page: currentPage,
    filters: {
      category,
      price_min,
      price_max,
      sort,
    },
  });

  const products = data?.products || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <ProductFilters
            searchParams={{
              page: searchParams.get("page"),
              category,
              price_min,
              price_max,
              sort,
            }}
          />
        </div>

        {/* Product List */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">All Products</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {products.length} {products.length === 1 ? "product" : "products"}
              </span>
            </div>
          </div>

          <Suspense fallback={<ProductListSkeleton />}>
            {isLoading ? (
              <ProductListSkeleton />
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product: ProductVO) => (
                    <div key={product.sku} className="px-2 pb-2">
                      <Card
                        className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-[400px] flex flex-col border border-border/50"
                        onClick={() => router.push(`/products/${product.sku}`)}
                      >
                        <div className="relative aspect-square overflow-hidden">
                          <CardContent className="p-0 h-full">
                            <Image
                              src={product?.images?.[0] || "/placeholder.svg"}
                              alt={product?.name || "Product image"}
                              fill
                              className="object-cover transition-transform duration-500"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </CardContent>

                          <div className="absolute top-3 right-3 space-y-1">
                            {product.isNew && <Badge className="bg-green-500 hover:bg-green-500 text-white px-2 py-1">New</Badge>}
                            {product.discountPercentage && product.discountPercentage > 0 && (
                              <Badge className="px-2 py-1">{product.discountPercentage}% OFF</Badge>
                            )}
                          </div>
                        </div>

                        <CardHeader className="px-4 pb-2 pt-4 flex-1">
                          <CardTitle className="text-xl  font-bold truncate">{product.name}</CardTitle>
                          <CardDescription className="text-sm mt-1 line-clamp-2">{product.description}</CardDescription>
                        </CardHeader>

                        <CardFooter className="px-4 pb-4">
                          <div className="w-full">
                            {product.discountPercentage && product.discountPercentage > 0 ? (
                              <div className="flex flex-col">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-lg font-bold text-foreground">${product.finalPrice?.toFixed(2)}</span>
                                  <span className="text-sm line-through text-muted-foreground">${product.basePrice?.toFixed(2)}</span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  You save ${((product?.basePrice ?? 0) - (product?.finalPrice ?? 0)).toFixed(2)}
                                </div>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-foreground">${product.basePrice?.toFixed(2)}</span>
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination totalPages={totalPages} currentPage={currentPage} />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No products found. Try adjusting your filters.</p>
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
