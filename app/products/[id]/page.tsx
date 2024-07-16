"use client";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { getProductById } from "@/serverActions/productActions";
import { Product } from "@/types/Product";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

type ProductDetailProps = {};

export const ProductDetail: React.FC<ProductDetailProps> = React.memo(function ProductDetail({}) {
  const params: { id: string } = useParams();
  const [product, setProduct] = React.useState<Product | null>(null);

  React.useEffect(() => {
    async function productData() {
      const response = await getProductById(params.id);
      setProduct(response);
    }
    productData();
  }, []);

  console.log(product);

  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "No Title";
  return (
    <div className="max-w-[1500px] m-auto w-full py-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="text-md" href="/">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-md" href="/Products">
              Products
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-md">New Arrival</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid grid-cols-2">
        <div className="col-span-1">
          <div className=""></div>
          <div></div>
        </div>
        <div className="col-span-1"></div>
      </div>
    </div>
  );
});

export default ProductDetail;
