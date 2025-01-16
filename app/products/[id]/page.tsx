"use client";
import { StarRating } from "@/components/StarRating";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductById } from "@/serverActions/productActions";
import { getAllReviewsByProductId } from "@/serverActions/reviewActions";
import { Product } from "@/types/Product";
import { Review } from "@/types/Review";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { MinusIcon, PlusIcon, ShieldCheckIcon, SlidersHorizontal } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

type ProductDetailProps = {};

export const ProductDetail: React.FC<ProductDetailProps> = React.memo(function ProductDetail({}) {
  const params = useParams();
  const productId: string = typeof params.id === "string" ? params.id : params?.id[0];
  const [product, setProduct] = React.useState<Product | null>();
  const [count, setCount] = React.useState<number>(1);
  const [size, setSize] = React.useState<string>("small");
  const [reviews, setReviews] = React.useState<Map<string, Review>>(new Map());
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);

  const sizes = ["Small", "Medium", "Large", "X-Large"];

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
      console.log(response);
      if (!response) return;
      setReviews((prevReviews) => {
        const newReviews = new Map(prevReviews);
        response.reviews.forEach((review) => newReviews.set(review.id, review));
        return newReviews;
      });
      setHasMore(response?.hasMore ?? false);
      setPage(response.current_page);
    }
    fetchReviews();
  }, [product, page]);

  const incrementCount = React.useCallback(() => {
    setCount((prevCount) => prevCount + 1);
  }, []);

  const decrementCount = React.useCallback(() => {
    setCount((prevCount) => prevCount - 1);
  }, []);

  return (
    <div className="container m-auto w-full py-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="text-base" href="/">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-base" href="/Products">
              Products
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base">New Arrival</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <div className="w-full flex flex-col-reverse lg:flex-row gap-4">
          {product && product.images.length > 0 && (
            <div className="flex flex-col-reverse lg:flex-row gap-4">
              {/* Thumbnails */}
              <div className="flex lg:flex-col basis-1/3 gap-3">
                {product?.images.slice(1).map((image, index) => (
                  <div key={index} className="flex-grow overflow-hidden w-full h-[167px]">
                    <img src={image} alt={`Thumbnail ${index}`} className="w-full h-full aspect-square rounded-lg" />
                  </div>
                ))}
              </div>

              {/* Main Image */}
              <div className="h-[290px] lg:h-[530px]">
                <div className="h-full">
                  <img src={product?.images[0]} alt="Main" className="w-full h-full object-fill rounded-lg" />
                </div>
              </div>
            </div>
          )}
          {(!product?.images || product.images.length === 0) && (
            <div className="w-full flex flex-col items-center justify-center gap-4">
              <div className="w-full h-[290px] lg:h-[530px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 flex items-center justify-center rounded-lg border border-gray-300">
                <span className="text-gray-700 font-bold text-lg" style={{ fontFamily: "'Roboto', sans-serif" }}>
                  No Image Available
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="col-span-1 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2 flex-wrap">
            <h3 className="text-4xl font-bold">{product?.name}</h3>
            <StarRating rating={Math.ceil(product?.rating || 0)} />
            <p className="text-2xl md:text-3xl font-semibold">${product?.price}</p>
            <p className="text-base text-muted-foreground">{product?.description}</p>
          </div>
          <div className="w-full h-[1px] rounded-full bg-secondary-foreground" />
          <div className="flex flex-col gap-4 flex-wrap">
            <p className="text-base text-muted-foreground">Choose Color</p>
            <div className="flex gap-4">
              <p className="w-10 h-10 bg-slate-400 rounded-full"></p>
              <p className="w-10 h-10 bg-emerald-400 rounded-full"></p>
              <p className="w-10 h-10 bg-rose-400 rounded-full"></p>
            </div>
          </div>
          <div className="w-full h-[1px] rounded-full bg-secondary-foreground" />
          <div className="flex flex-col gap-4 flex-wrap">
            <p className="text-base text-muted-foreground">Choose Size</p>
            <div className="flex gap-4 text-base flex-wrap">
              {sizes.map((currentSize) => {
                return (
                  <p
                    key={currentSize}
                    onClick={() => {
                      setSize(currentSize);
                    }}
                    className={`px-6 py-3 ${
                      size === currentSize ? "bg-primary text-primary-foreground" : "bg-secondary"
                    } cursor-pointer rounded-full `}
                  >
                    {currentSize}
                  </p>
                );
              })}
            </div>
          </div>
          <div className="w-full h-[1px] rounded-full bg-secondary-foreground" />
          <div className="flex gap-8 ">
            <div className="flex items-center justify-center">
              <Button
                onClick={decrementCount}
                variant="secondary"
                className="bg-secondary text-accent-foreground rounded-l-full hover:bg-secondary-foreground/20"
              >
                <MinusIcon />
              </Button>
              <p className="bg-secondary p-2 flex items-center text-accent-foreground">{count}</p>
              <Button
                onClick={incrementCount}
                variant="secondary"
                className="bg-secondary text-accent-foreground rounded-r-full hover:bg-secondary-foreground/20"
              >
                <PlusIcon />
              </Button>
            </div>
            <Button className="flex-grow rounded-full">Add to Cart</Button>
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-between my-4">
          <h4 className="font-bold text-2xl">All Reviews</h4>
          <div className="flex gap-5">
            <div className="bg-secondary cursor-pointer w-max rounded-full p-2">
              <SlidersHorizontal />
            </div>

            <Button className="rounded-full">Write a Review</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...reviews.values()].map((review, index) => (
            <div key={`review-${index}`} className="p-1">
              <Card>
                <CardHeader>
                  <StarRating rating={review.rating} />
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <div className="flex flex-grow items-center gap-4">
                    <Avatar className="bg-slate-300 p-2 rounded-full">
                      <AvatarImage src={review.user.avatar} alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{review.user.username}</CardTitle>
                  </div>
                  <ShieldCheckIcon className="w-6 h-6" color="green" />
                </CardContent>
                <CardFooter>
                  <CardDescription>
                    <q>{review.comment}</q>
                  </CardDescription>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default ProductDetail;
