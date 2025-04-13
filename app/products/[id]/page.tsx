"use client";
import { ProductDescription } from "@/components/ProductDescription";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductInfo } from "@/components/ProductInfo";
import { ProductReviews } from "@/components/ProductReview";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductById } from "@/serverActions/productActions";
import { getAllReviewsByProductId } from "@/serverActions/reviewActions";
import { Product } from "@/types/Product";
import { Review } from "@/types/Review";
import { useParams } from "next/navigation";
import React, { useEffect, useCallback } from "react";

type ProductDetailProps = {};

export const ProductDetail: React.FC<ProductDetailProps> = React.memo(
  function ProductDetail({}) {
    const params = useParams();
    const productId: string =
      typeof params.id === "string" ? params.id : params?.id[0];
    const [product, setProduct] = React.useState<Product | null>();
    const [count, setCount] = React.useState<number>(1);
    const [size, setSize] = React.useState<string>("Small");
    const [selectedColor, setSelectedColor] = React.useState<string>("Slate");
    const [reviews, setReviews] = React.useState<Map<string, Review>>(
      new Map()
    );
    const [page, setPage] = React.useState(1);
    const [hasMore, setHasMore] = React.useState(true);

    useEffect(() => {
      async function fetchProduct() {
        const response = await getProductById(productId);
        setProduct(response);
      }
      fetchProduct();
    }, [productId]);

    useEffect(() => {
      async function fetchReviews() {
        if (!product) return;
        const response = await getAllReviewsByProductId({
          productId: product.id,
          page,
        });
        if (!response) return;
        setReviews((prevReviews) => {
          const newReviews = new Map(prevReviews);
          response.reviews.forEach((review) =>
            newReviews.set(review.id, review)
          );
          return newReviews;
        });
        setHasMore(response?.hasMore ?? false);
        setPage(response.current_page);
      }
      fetchReviews();
    }, [product, page]);

    const incrementCount = useCallback(() => {
      setCount((prevCount) => prevCount + 1);
    }, []);

    const decrementCount = useCallback(() => {
      setCount((prevCount) => Math.max(1, prevCount - 1));
    }, []);

    if (!product) {
      return (
        <div className="container max-w-7xl mx-auto px-4 py-8 text-center text-lg sm:text-xl">
          Loading...
        </div>
      );
    }

    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/products"
                className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Products
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xs sm:text-sm font-medium">
                {product?.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Product Main Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <ProductGallery images={product.images} />
          <ProductInfo
            product={product}
            reviewsCount={[...reviews.values()].length}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            size={size}
            setSize={setSize}
            count={count}
            incrementCount={incrementCount}
            decrementCount={decrementCount}
          />
        </div>

        {/* Description & Reviews Section */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-xs sm:max-w-sm">
            <TabsTrigger
              value="description"
              className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
            >
              Reviews ({[...reviews.values()].length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <ProductDescription description={product.description} />
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <ProductReviews
              reviews={[...reviews.values()]}
              productId={productId}
              onReviewSubmit={(newReview) => {
                setReviews((prev) => {
                  const newReviews = new Map(prev);
                  newReviews.set(newReview.id, newReview);
                  return newReviews;
                });
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }
);

export default ProductDetail;
