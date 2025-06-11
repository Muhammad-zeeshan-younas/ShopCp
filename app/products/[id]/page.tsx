"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  FC,
  useReducer,
} from "react";
import { useParams } from "next/navigation";

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
import { ProductVO, ReviewVO, VariantVO } from "@/utils/parsers";

const PAGE_SIZE = 5;

type ReviewFetchResponse = ReviewVO[] | { reviews: ReviewVO[] } | undefined;

const normalizeReviews = (data: ReviewFetchResponse): ReviewVO[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray((data as any).reviews)) return (data as any).reviews;
  return [];
};

// Reducer to manage reviews state as a Map
function reviewsReducer(
  state: Map<string, ReviewVO>,
  action:
    | { type: "add"; reviews: ReviewVO[] }
    | { type: "reset"; reviews: ReviewVO[] }
): Map<string, ReviewVO> {
  switch (action.type) {
    case "add": {
      const updated = new Map(state);
      action.reviews.forEach((r) => updated.set(String(r.id), r));
      return updated;
    }
    case "reset": {
      const newMap = new Map<string, ReviewVO>();
      action.reviews.forEach((r) => newMap.set(String(r.id), r));
      return newMap;
    }
    default:
      return state;
  }
}

const ProductDetail: FC = () => {
  const params = useParams();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [product, setProduct] = useState<ProductVO | null>(null);
  const [count, setCount] = useState(1);

  // Reviews state with reducer
  const [reviews, dispatchReviews] = useReducer(reviewsReducer, new Map());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Derived variant metadata memoized
  const availableSizes = useMemo(() => {
    if (!product) return [];
    const sizesSet = new Set<string>();
    product.variants?.forEach((variant: VariantVO) => {
      if (variant.size) sizesSet.add(String(variant.size));
    });
    return Array.from(sizesSet);
  }, [product]);

  const availableColors = useMemo(() => {
    if (!product) return [];
    const colorsSet = new Set<string>();
    product.variants?.forEach((variant: VariantVO) => {
      if (variant.color) colorsSet.add(String(variant.color));
    });
    return Array.from(colorsSet);
  }, [product]);

  const [size, setSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // Initialize size and color when product or their arrays change
  useEffect(() => {
    if (availableSizes.length > 0) setSize((prev) => prev || availableSizes[0]);
    if (availableColors.length > 0)
      setSelectedColor((prev) => prev || availableColors[0]);
  }, [availableSizes, availableColors]);

  // Fetch product once
  useEffect(() => {
    if (!productId) return;

    (async () => {
      const response = await getProductById(productId);
      setProduct(response);
    })();
  }, [productId]);

  // Fetch reviews on product & page change
  useEffect(() => {
    if (!product) return;

    let cancelled = false;

    (async () => {
      const rawResponse: ReviewFetchResponse = await getAllReviewsByProductId({
        productId: product.id,
        page,
      });

      if (cancelled) return;

      const reviewList = normalizeReviews(rawResponse);

      if (reviewList.length === 0) {
        setHasMore(false);
        return;
      }

      if (page === 1) {
        dispatchReviews({ type: "reset", reviews: reviewList });
      } else {
        dispatchReviews({ type: "add", reviews: reviewList });
      }

      if (reviewList.length < PAGE_SIZE) setHasMore(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [product, page]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!hasMore || !loadMoreRef.current) return;

    const currentObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setPage((prev) => prev + 1);
    });

    currentObserver.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) currentObserver.unobserve(loadMoreRef.current);
    };
  }, [hasMore]);

  const incrementCount = useCallback(() => setCount((prev) => prev + 1), []);
  const decrementCount = useCallback(
    () => setCount((prev) => Math.max(1, prev - 1)),
    []
  );

  if (!product) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8 text-center text-lg sm:text-xl animate-pulse">
        Loading product…
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Home
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
            <BreadcrumbPage className="text-xs sm:text-sm font-medium text-primary">
              {product.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main section */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start mb-16">
        <ProductGallery images={product.images ?? []} />

        <div className="lg:sticky lg:top-24">
          <ProductInfo
            product={product}
            reviewsCount={reviews.size}
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

      {/* Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid grid-cols-2 w-full sm:w-auto">
          <TabsTrigger
            value="description"
            className="px-4 py-2 text-sm sm:text-base"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="px-4 py-2 text-sm sm:text-base"
          >
            Reviews ({reviews.size})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-8 prose max-w-none">
          <ProductDescription description={product.description ?? ""} />
        </TabsContent>

        <TabsContent value="reviews" className="mt-8 space-y-6">
          <ProductReviews
            reviews={[...reviews.values()]}
            productId={productId}
            onReviewSubmit={(newReview) => {
              dispatchReviews({ type: "add", reviews: [newReview] });
            }}
          />

          {hasMore ? (
            <div
              ref={loadMoreRef}
              className="text-center py-6 text-sm text-muted-foreground animate-pulse"
            >
              Loading more reviews…
            </div>
          ) : (
            <p className="text-center py-6 text-sm text-muted-foreground">
              No more reviews.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default React.memo(ProductDetail);
