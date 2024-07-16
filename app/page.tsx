"use client";
import { Navbar } from "@/components/Navbar";
import Brands from "@/sections/Brands";
import Hero from "@/sections/Hero";
import Image from "next/image";
import HeighlightSection from "@/sections/HighlightSection";
import Testimonials from "@/sections/Testimonials";
import { getProducts } from "@/serverActions/productActions";
import React, { Suspense } from "react";
import { Product } from "@/types/Product";
import Loadiong from "./loading";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment-timezone";
import { getAllReview } from "@/serverActions/reviewActions";
import { Review } from "@/types/Review";

export default function Home() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  React.useEffect(() => {
    async function products() {
      const response = await getProducts();
      setProducts(response);
    }
    products();
  }, []);
  React.useEffect(() => {
    async function reviews() {
      const response = await getAllReview();
      setReviews(response);
    }
    reviews();
  }, []);

  const recentReviews: Review[] = React.useMemo(() => {
    if (!!!reviews.length) return [];
    return reviews.sort((a, b) => moment(b.created_at).valueOf() - moment(a.created_at).valueOf()).slice(0, 10);
  }, [reviews]);

  const topSellingProducts: Product[] = React.useMemo(() => {
    if (!!!products.length) return [];
    return products.sort((a, b) => b.sales_count - a.sales_count).slice(0, 5);
  }, [products]);

  const newArrivalProducts: Product[] = React.useMemo(() => {
    if (!!!products.length) return [];
    return products.sort((a, b) => moment(b.created_at).valueOf() - moment(a.created_at).valueOf()).slice(0, 10);
  }, [products]);

  const loading = React.useMemo(() => {
    return !(!!topSellingProducts.length && !!newArrivalProducts.length && !!recentReviews.length);
  }, [topSellingProducts, newArrivalProducts, recentReviews]);

  console.log(recentReviews);
  if (loading) {
    return (
      <div className="w-full">
        <div className="flex flex-col space-y-3 w-3/4 m-auto py-4">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <div className="space-y-2 pt-4">
            <Skeleton className="h-7 w-[250px] " />
            <div className="flex gap-4 pt-7">
              <Skeleton className="aspect-square w-[200px]" />
              <Skeleton className="aspect-square w-[200px]" />
              <Skeleton className="aspect-square w-[200px]" />
              <Skeleton className="aspect-square w-[200px]" />
              <Skeleton className="aspect-square w-[200px]" />
              <Skeleton className="aspect-square w-[200px]" />
            </div>
          </div>
          <div className="space-y-2 pt-4">
            <Skeleton className="h-7 w-[250px] " />
            <div className="flex gap-4 pt-7">
              <Skeleton className="aspect-square w-[200px]" />
              <Skeleton className="aspect-square w-[200px]" />
              <Skeleton className="aspect-square w-[200px]" />
              <Skeleton className="aspect-square w-[200px]" />
              <Skeleton className="aspect-square w-[200px]" />
              <Skeleton className="aspect-square w-[200px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <Suspense fallback={<Loadiong />}>
      <Hero />
      <Brands />
      <HeighlightSection title="NEW ARRIVAL" items={newArrivalProducts} />
      <HeighlightSection title="TOP SELLING" items={topSellingProducts} />
      <Testimonials reviews={recentReviews} />
    </Suspense>
  );
}
