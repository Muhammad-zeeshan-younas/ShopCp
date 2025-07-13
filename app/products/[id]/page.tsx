"use client";

import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

// Components
import { ProductDescription } from "@/components/ProductDescription";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductInfo } from "@/components/ProductInfo";
import { ProductReviews } from "@/components/ProductReview";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Hooks and Types
import { VariantVO } from "@/utils/parsers";
import { useProductByIdQuery, useReviewsByProductIdQuery } from "@/Queries";

const PAGE_SIZE = 5;

const ProductDetail = () => {
  const params = useParams();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;

  // State management
  const [count, setCount] = useState(1);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { data: product, isLoading } = useProductByIdQuery(productId);
  const { data: reviews = [], isLoading: isLoadingReviews } = useReviewsByProductIdQuery(product?.id ? Number(product.id) : undefined, page);

  // Derived values
  const { availableSizes, availableColors } = useMemo(() => {
    const sizes = new Set<string>();
    const colors = new Set<string>();

    product?.variants?.forEach((variant: VariantVO) => {
      if (variant.size) sizes.add(String(variant.size));
      if (variant.color) colors.add(String(variant.color));
    });

    return {
      availableSizes: Array.from(sizes),
      availableColors: Array.from(colors),
    };
  }, [product]);

  // Initialize default selections
  useEffect(() => {
    if (availableSizes.length > 0 && !size) {
      setSize(availableSizes[0]);
    }
    if (availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0]);
    }
  }, [availableSizes, availableColors, size, selectedColor]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && reviews.length >= PAGE_SIZE) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [reviews.length]);

  const incrementCount = useCallback(() => {
    if (count >= 2) {
      toast.warning("Maximum 2 items allowed. For bulk orders please contact us.");
      return;
    }
    setCount((prev) => prev + 1);
  }, [count]);

  const decrementCount = useCallback(() => {
    setCount((prev) => Math.max(1, prev - 1));
  }, []);

  if (isLoading) {
    return <div className="container max-w-7xl mx-auto px-4 py-8 text-center text-lg sm:text-xl animate-pulse">Loading product...</div>;
  }

  if (!product) {
    return <div className="container max-w-7xl mx-auto px-4 py-8 text-center text-lg sm:text-xl">Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products" className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary">
              Products
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-xs sm:text-sm font-medium text-primary">{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start mb-16">
        <ProductGallery images={product.images ?? []} />

        <div className="lg:sticky lg:top-24">
          <ProductInfo
            product={product}
            reviewsCount={reviews.length}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            size={size}
            setSize={setSize}
            availableSizes={availableSizes}
            availableColors={availableColors}
            count={count}
            incrementCount={incrementCount}
            decrementCount={decrementCount}
          />
        </div>
      </div>

      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid grid-cols-2 w-full sm:w-auto">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-8 prose max-w-none">
          <ProductDescription description={product.description ?? ""} />
        </TabsContent>

        <TabsContent value="reviews" className="mt-8 space-y-6">
          <ProductReviews
            reviews={reviews}
            productId={productId}
            onReviewSubmit={(newReview) => {
              // Handle optimistic update if needed
              // You might want to invalidate the query here
            }}
          />

          {isLoadingReviews ? (
            <div className="text-center py-6 text-sm text-muted-foreground animate-pulse">Loading reviews...</div>
          ) : (
            <div ref={loadMoreRef} className="text-center py-6 text-sm text-muted-foreground">
              {reviews.length >= PAGE_SIZE ? "Scroll to load more" : "All reviews loaded"}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default React.memo(ProductDetail);
