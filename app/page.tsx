import { Navbar } from "@/components/Navbar";
import Brands from "@/sections/Brands";
import Hero from "@/sections/Hero";
import Image from "next/image";
import HeighlightSection from "@/sections/HighlightSection";
import Testimonials from "@/sections/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <Brands />
      <HeighlightSection title="NEW ARRIVAL" />
      <HeighlightSection title="TOP SELLING" />
      <Testimonials />
    </>
  );
}
