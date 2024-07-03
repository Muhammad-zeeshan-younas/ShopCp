"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { RxDividerVertical } from "react-icons/rx";

type HeroProps = {};

export const Hero: React.FC<HeroProps> = React.memo(function Hero({}) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 sm:px-14 lg:px-20 xl:px-56 sm:h-[80dvh] px-4 gap-16 py-6">
      <div className="col-span-1 grid h-max m-auto">
        <h3 className="sm:text-6xl text-4xl rubik-wet-paint-regular mb-6">Find The Best 3D Design For Your Next Project</h3>
        <p className="text-muted-foreground mb-8">
          Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
        </p>
        <Button variant="default" className="rounded-full sm:w-max px-12 py-6 mb-10 w-full">
          Shop Now
        </Button>

        <div className="flex justify-between w-full">
          <div>
            <h5 className="text-xl sm:text-3xl font-bold text-primary">200+</h5>
            <p className="text-muted-foreground text-xs sm:text-base">International Brands</p>
          </div>
          <RxDividerVertical className="h-full w-12 sm:w-16 text-primary/10" />
          <div>
            <h5 className="text-xl sm:text-3xl font-bold text-primary">2000+</h5>
            <p className="text-muted-foreground text-xs sm:text-base">High Quality Products</p>
          </div>
          <RxDividerVertical className="h-full w-12 sm:w-16 text-primary/10" />
          <div>
            <h5 className="text-xl sm:text-3xl font-bold text-primary">30000+</h5>
            <p className="text-muted-foreground text-xs sm:text-base">Happy Customers</p>
          </div>
        </div>
      </div>
      <div className="relative grid place-items-center">
        <div className="relative m-auto w-[200px] h-[300px] sm:w-[400px] sm:h-[500px] lg:w-[500px] lg:h-[600px]">
          <Image className=" border-none bg-transparent" src="/3dimage.png" alt="" layout="fill" objectFit="cover" quality={100} />
        </div>
      </div>
    </div>
  );
});

export default Hero;
