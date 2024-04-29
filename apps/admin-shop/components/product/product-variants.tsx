"use client";
import { ProductVariant, StrippedProductVariant } from "@ditch/lib";
import { PlusCircle, TrashIcon } from "lucide-react";
import { useState } from "react";

import { ProductFieldErrors } from "@/components/product/schemes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProductVariants({
  variants,
  variantsFieldError,
}: {
  variants?: ProductVariant[];
  variantsFieldError?: ProductFieldErrors["variants"];
}) {
  const [productVariants, setProductVariants] = useState<
    StrippedProductVariant[]
  >(variants || []);

  const addVariant = () => {
    setProductVariants([
      ...productVariants,
      {
        size: "",
        color: "",
        material: "",
        quantity: 0,
      },
    ]);
  };

  const removeVariant = (index: number) => {
    setProductVariants(productVariants.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Variants</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Size</TableHead>
              <TableHead>Color</TableHead>
              {/*<TableHead>Material</TableHead>*/}
              <TableHead>Quantity</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productVariants.map((variant, index) => (
              <ProductVariantDisplay
                key={index}
                variant={variant}
                index={index}
                removeVariant={removeVariant}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-center border-t p-4">
        {variantsFieldError && (
          <p className="text-destructive text-center text-xs">
            {variantsFieldError[0]}
          </p>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="gap-1"
          type="button"
          onClick={addVariant}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Add Variant
        </Button>
      </CardFooter>
    </Card>
  );
}

function ProductVariantDisplay({
  variant,
  index,
  removeVariant,
}: {
  variant?: StrippedProductVariant;
  index: number;
  removeVariant: (index: number) => void;
}) {
  return (
    <TableRow>
      <TableCell className="font-semibold">
        <Label htmlFor={"variant-size-" + index} className="sr-only">
          Size
        </Label>
        <Input
          id={"variant-size-" + index}
          type="text"
          name={"variant-size-" + index}
          defaultValue={variant?.size || ""}
        />
      </TableCell>
      <TableCell className="font-semibold">
        <Label htmlFor={"variant-color-" + index} className="sr-only">
          Color
        </Label>
        <Input
          id={"variant-color-" + index}
          name={"variant-color-" + index}
          type="text"
          defaultValue={variant?.color || ""}
        />
      </TableCell>
      {/*<TableCell className="font-semibold">*/}
      {/*  <Label htmlFor={"variant-material-" + index} className="sr-only">*/}
      {/*    Material*/}
      {/*  </Label>*/}
      {/*  <Input*/}
      {/*    id={"variant-material-" + index}*/}
      {/*    name={"variant-material-" + index}*/}
      {/*    type="text"*/}
      {/*    defaultValue={variant?.material || ""}*/}
      {/*  />*/}
      {/*</TableCell>*/}
      <TableCell className="font-semibold">
        <Label htmlFor={"variant-quantity-" + index} className="sr-only">
          Quantity
        </Label>
        <Input
          id={"variant-quantity-" + index}
          name={"variant-quantity-" + index}
          type="number"
          defaultValue={variant?.material || ""}
        />
      </TableCell>
      <TableCell>
        <Label htmlFor={"variant-remove-" + index} className="sr-only">
          Remove
        </Label>
        <Button
          variant="outline"
          size="icon"
          type="button"
          className="h-7 w-7"
          onClick={() => removeVariant(index)}
        >
          <TrashIcon className="h-4 w-4 text-error cursor-pointer" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
