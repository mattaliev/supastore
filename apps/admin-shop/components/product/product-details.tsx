import { Product } from "@ditch/lib";

import Link from "@/components/navigation/link";
import { ProductFieldErrors } from "@/components/product/schemes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProductDetails({
  product,
  productDetailsFieldErrors,
}: {
  product?: Product;
  productDetailsFieldErrors?: {
    title?: ProductFieldErrors["title"];
    description?: ProductFieldErrors["description"];
    sku?: ProductFieldErrors["sku"];
    price?: ProductFieldErrors["price"];
    shortDescription?: ProductFieldErrors["shortDescription"];
  };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
        <CardDescription>
          Follow a <span> </span>
          <Link
            href={"https://guides.ditch-concept.com/pages/create-products"}
            inStore={false}
            localized={false}
            className={"underline hover:text-primary hover:no-underline"}
          >
            quick guide
          </Link>{" "}
          on how to create and update products
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            {productDetailsFieldErrors?.title && (
              <p className="text-destructive text-start text-xs">
                {productDetailsFieldErrors.title[0]}
              </p>
            )}
            <Input
              id="name"
              name="title"
              type="text"
              className="w-full"
              defaultValue={product?.title || ""}
              placeholder="Enter product name"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="short-description">Short Description</Label>
            {productDetailsFieldErrors?.shortDescription && (
              <p className="text-destructive text-start text-xs">
                {productDetailsFieldErrors.shortDescription[0]}
              </p>
            )}
            <Textarea
              id="short-description"
              name="short-description"
              defaultValue={product?.shortDescription || ""}
              placeholder="Enter short description (optional)"
              className="min-h-16"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">Long Description</Label>
            {productDetailsFieldErrors?.description && (
              <p className="text-destructive text-start text-xs">
                {productDetailsFieldErrors.description[0]}
              </p>
            )}
            <Textarea
              id="description"
              name="description"
              defaultValue={product?.description || ""}
              placeholder="Enter product description (optional)"
              className="min-h-32"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sku">SKU</Label>
            {productDetailsFieldErrors?.sku && (
              <p className="text-destructive text-start text-xs">
                {productDetailsFieldErrors.sku[0]}
              </p>
            )}
            <Input
              id="sku"
              type="text"
              name="sku"
              className="w-full"
              defaultValue={product?.sku || ""}
              placeholder="Enter product SKU"
            />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            {productDetailsFieldErrors?.price && (
              <p className="text-destructive text-start text-xs">
                {productDetailsFieldErrors.price[0]}
              </p>
            )}
            <div className="relative ml-auto md:grow-0 mt-3">
              <p className="absolute left-3.5 top-2 text-muted-foreground">$</p>
              <Input
                id="price"
                name="price"
                type="text"
                defaultValue={product?.price || ""}
                className="w-full pl-8"
                placeholder="Enter product price"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
