"use client";
import Brands from "@/sections/Brands";
import Hero from "@/sections/Hero";
import Testimonials from "@/sections/Testimonials";
import React, { Suspense, useMemo } from "react";
import Loading from "./loading";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment-timezone";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProductVO, ReviewVO } from "@/utils/parsers";
import HighlightSection from "@/sections/HighlightSection";
import { useAllReviewsQuery, useProductsQuery } from "@/Queries";

export default function Home() {
  const { data: products, isLoading, error } = useProductsQuery();
  const { data: reviews = [] } = useAllReviewsQuery();

  // Memoized derived data with proper typing
  const recentReviews: ReviewVO[] = useMemo(() => {
    return [...reviews].sort((a, b) => moment(b.created_at).valueOf() - moment(a.created_at).valueOf()).slice(0, 10);
  }, [reviews]);

  console.log(products);

  // Modified to use rating instead of sales_count
  const popularProducts: ProductVO[] = useMemo(() => {
    const safeProducts = products?.products ?? [];
    return [...safeProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);
  }, [products]);

  const newArrivalProducts: ProductVO[] = useMemo(() => {
    const safeProducts = products?.products ?? []; // fallback to empty array
    return [...safeProducts].sort((a, b) => moment(b.created_at).valueOf() - moment(a.created_at).valueOf()).slice(0, 10);
  }, [products]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-bold text-red-500 mb-4">Error loading data</h2>
        <p className="text-gray-600">{error instanceof Error ? error.message : "An unknown error occurred"}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Skeleton */}
          <Skeleton className="h-[400px] w-full rounded-xl mb-12" />

          {/* Brands Skeleton */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-32" />
            ))}
          </div>

          {/* Sections Skeleton */}
          {[...Array(2)].map((_, i) => (
            <div key={i} className="mb-12">
              <Skeleton className="h-8 w-64 mb-6" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="space-y-2">
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Testimonials Skeleton */}
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <div className="space-y-12">
          <Hero />
          <Brands />
          <HighlightSection title="NEW ARRIVALS" items={newArrivalProducts} />
          <HighlightSection title="POPULAR ITEMS" items={popularProducts} />
          <Testimonials reviews={recentReviews} />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}
