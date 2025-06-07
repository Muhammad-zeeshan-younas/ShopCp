"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Sparkles, Rotate3D, Box, Palette, Shirt } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import ThreeDModel from "@/hooks/ThreeDModel";

const Hero = () => {
  const modelContainerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />

      <div className="container relative grid grid-cols-1 gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
        {/* Content Column */}
        <div className="flex flex-col justify-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Badge with icon */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              <span>New Collection</span>
            </div>

            {/* Headline with gradient text */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl/none">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Find The Best 3D Design</span> <br />
              For Your Next Project
            </h1>

            {/* Subtitle with animated border */}
            <motion.p
              className="relative text-lg text-muted-foreground md:text-xl"
              whileInView={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="absolute -left-4 top-0 h-full w-0.5 bg-primary/30"></span>
              Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality.
            </motion.p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="group rounded-full px-8 py-6 text-lg font-semibold shadow-lg transition-all hover:shadow-primary/20">
                <span>Shop Now</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg font-medium">
                <span>Explore Designs</span>
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Stats with hover effects */}
          <motion.div className="grid grid-cols-3 gap-6 pt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            {[
              { value: "200+", label: "International Brands" },
              { value: "2K+", label: "Premium Products" },
              { value: "30K+", label: "Happy Customers" },
            ].map((stat, index) => (
              <motion.div key={index} whileHover={{ y: -5 }} className="group cursor-default">
                <Card className="border-none bg-background/50 p-4 shadow-sm backdrop-blur-sm transition-all group-hover:bg-background/80 group-hover:shadow-md">
                  <p className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</p>
                  <p className="text-sm text-muted-foreground sm:text-base">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 3D Model Column */}
        <motion.div
          className="relative h-full min-h-[500px]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          ref={modelContainerRef}
        >
          <Card className="relative h-full w-full overflow-hidden rounded-2xl border border-primary/10 shadow-xl">
            <ThreeDModel
              modelPath="/models/green_dragon.glb" // Update this path
              containerRef={modelContainerRef}
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent pointer-events-none" />
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
