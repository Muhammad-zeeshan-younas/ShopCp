"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useRef } from "react";

type TestimonialsProps = {};

export const Testimonials: React.FC<TestimonialsProps> = React.memo(function Testimonials() {
  const arrowRightRef = useRef<HTMLButtonElement>(null);
  const arrowLeftRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="py-10 sm:py-14 bg-background px-12 sm:px-16 md:px-24">
      <div className="flex items-center justify-between py-6">
        <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold">OUR HAPPY CUSTOMERS</h3>
        <div className="flex gap-4 items-center">
          <ArrowLeft
            className="h-6 w-6"
            onClick={() => {
              arrowLeftRef.current?.click();
            }}
          />
          <ArrowRight
            className="h-6 w-6"
            onClick={() => {
              arrowRightRef.current?.click();
            }}
          />
        </div>
      </div>

      <Carousel orientation="horizontal" className="w-full m-auto">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </CardContent>
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

export default Testimonials;
