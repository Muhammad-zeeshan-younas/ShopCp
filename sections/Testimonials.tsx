"use client";

import { StarRating } from "@/components/StarRating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChevronRight, ShieldCheckIcon } from "lucide-react";
import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ReviewVO } from "@/utils/parsers";

type ReviewsProps = {
  reviews: ReviewVO[];
};

export const Reviews: React.FC<ReviewsProps> = React.memo(function Reviews({ reviews }) {
  const sliderRef = useRef<Slider>(null);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="container w-full px-4 sm:px-8 py-8">
      <div className="w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold">OUR HAPPY CUSTOMERS</h2>
        </div>

        <Slider ref={sliderRef} {...sliderSettings}>
          {reviews.map((review, index) => (
            <div key={index} className="px-2">
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col border border-border/50">
                <CardHeader className="px-4 pb-2 pt-4">
                  <StarRating rating={review.rating || 0} />
                </CardHeader>
                <CardContent className="flex items-center gap-4 px-4 pb-2">
                  <div className="flex flex-grow items-center gap-4">
                    <Avatar>
                      <AvatarImage src={review?.user?.avatar} alt={review?.user?.username || "User"} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{review?.user?.username}</CardTitle>
                  </div>
                  <ShieldCheckIcon className="w-6 h-6 text-green-500" />
                </CardContent>
                <CardFooter className="px-4 pb-4">
                  <CardDescription className="line-clamp-3">
                    <q>{review.comment}</q>
                  </CardDescription>
                </CardFooter>
              </Card>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
});

export default Reviews;
