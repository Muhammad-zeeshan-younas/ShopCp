"use client";
import { StarRating } from "@/components/StarRating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, useCarousel } from "@/components/ui/carousel";
import { Review } from "@/types/Review";
import { ArrowLeft, ArrowRight, ShieldCheckIcon } from "lucide-react";
import React, { useRef } from "react";

type ReviewsProps = {
  reviews: Review[];
};

export const Reviews: React.FC<ReviewsProps> = React.memo(function Reviews({ reviews }) {
  const arrowRightRef = useRef<HTMLButtonElement>(null);
  const arrowLeftRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="py-10 sm:py-14 bg-background container">
      <div className="flex items-center justify-between py-6">
        <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold">OUR HAPPY CUSTOMERS</h3>
        <div className="flex gap-4 items-center">
          <Button className="p-1 rounded-full bg-transparent border-transparent" variant="outline">
            <ArrowLeft
              className="h-6 w-6 cursor-pointer"
              onClick={() => {
                arrowLeftRef.current?.click();
              }}
            />
          </Button>
          <Button className="p-1 rounded-full bg-transparent border-transparent" variant="outline">
            <ArrowRight
              className="h-6 w-6 cursor-pointer"
              onClick={() => {
                arrowRightRef.current?.click();
              }}
            />
          </Button>
        </div>
      </div>

      <Carousel orientation="horizontal" className="w-full m-auto">
        <CarouselContent>
          {reviews.map((review, index) => (
            <CarouselItem key={index} className="md:basis-1/3 xl:basis-1/5">
              <div className="p-1">
                <Card>
                  <CardHeader>
                    <StarRating rating={review.rating} />
                  </CardHeader>
                  <CardContent className="flex items-center gap-4">
                    <div className="flex flex-grow items-center gap-4">
                      <Avatar>
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
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden" ref={arrowLeftRef} />
        <CarouselNext className="hidden" ref={arrowRightRef} />
      </Carousel>
    </div>
  );
});

export default Reviews;
