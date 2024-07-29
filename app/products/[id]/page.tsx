"use client";
import { StarRating } from "@/components/StarRating";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/serverActions/productActions";
import { Product } from "@/types/Product";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { RxDividerHorizontal } from "react-icons/rx";

type ProductDetailProps = {};

export const ProductDetail: React.FC<ProductDetailProps> = React.memo(function ProductDetail({}) {
  const params = useParams();
  const productId: string = typeof params.id === "string" ? params.id : params?.id[0];
  const [product, setProduct] = React.useState<Product | null>();
  const [count, setCount] = React.useState<number>(1);
  const [size, setSize] = React.useState<string>("small");

  useEffect(() => {
    async function fetchProduct() {
      const response = await getProductById(productId);
      setProduct(response);
    }
    fetchProduct();
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
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="w-full flex flex-col-reverse lg:flex-row gap-4">
          <div className="flex lg:flex-col basis-1/3 gap-3">
            {product?.images.slice(1).map((image, index) => (
              <div key={index} className="flex-grow overflow-hidden w-full h-[167px]">
                <img src={image} alt={`Thumbnail ${index}`} className="w-full h-full aspect-square rounded-lg" />
              </div>
            ))}
          </div>
          <div className="h-[290px] lg:h-[530px]">
            <div className="h-full">
              <img src={product?.images[0]} alt="Main" className="w-full h-full object-fill  rounded-lg" />
            </div>
          </div>
        </div>

        <div className="col-span-1 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2 flex-wrap">
            <h3 className="text-4xl font-bold">{product?.name}</h3>
            <StarRating rating={Math.ceil(product?.rating || 0)} />
            <p className="text-2xl md:text-3xl font-semibold">${product?.price}</p>
            <p className="text-base text-muted-foreground">{product?.description}</p>
          </div>
          <div className="w-full h-[1px] rounded-full bg-accent-foreground" />
          <div className="flex flex-col gap-4 flex-wrap">
            <h4 className="text-base text-muted-foreground">Choose Color</h4>
            <div className="flex gap-4">
              <p className=" w-10 h-10 bg-slate-400 rounded-full"></p>
              <p className=" w-10 h-10 bg-emerald-400 rounded-full"></p>
              <p className=" w-10 h-10 bg-rose-400 rounded-full"></p>
            </div>
          </div>
          <div className="w-full h-[1px] rounded-full bg-accent-foreground" />
          <div className="flex flex-col gap-4 flex-wrap">
            <h5 className="text-base text-muted-foreground">Choose Size</h5>
            <div className="flex gap-4 text-base flex-wrap">
              <p
                onClick={() => {
                  setSize("small");
                }}
                className={`px-6 py-3 ${size === "small" ? "bg-primary" : "bg-neutral-400 hover:bg-neutral-500"} cursor-pointer  text-white rounded-full `}
              >
                Small
              </p>
              <p
                onClick={() => {
                  setSize("medium");
                }}
                className={`px-6 py-3 ${size === "medium" ? "bg-primary" : "bg-neutral-400 hover:bg-neutral-500"} cursor-pointer  text-white rounded-full `}
              >
                Medium
              </p>
              <p
                onClick={() => {
                  setSize("large");
                }}
                className={`px-6 py-3 ${size === "large" ? "bg-primary" : "bg-neutral-400 hover:bg-neutral-500"} cursor-pointer  text-white rounded-full `}
              >
                Large
              </p>
              <p
                onClick={() => {
                  setSize("xl");
                }}
                className={`px-6 py-3 ${size === "xl" ? "bg-primary" : "bg-neutral-400 hover:bg-neutral-500"} cursor-pointer  text-white rounded-full `}
              >
                X-Large
              </p>
            </div>
          </div>
          <div className="w-full h-[1px] rounded-full bg-accent-foreground" />
          <div className="flex gap-8 ">
            <div className="bg-neutral-400 w-max px-4 text-white rounded-full flex items-center text-lg font-bold gap-2">
              <Button variant="ghost">
                <MinusIcon />
              </Button>
              <span>1</span>
              <Button variant="secondary" className="cursor-pointer bg-transparent text-white">
                <PlusIcon />
              </Button>
            </div>
            <Button className="flex-grow rounded-full py-7 text-lg"> Add to Cart</Button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductDetail;
