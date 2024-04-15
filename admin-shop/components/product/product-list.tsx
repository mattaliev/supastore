import Image from "next/image";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/lib/api/types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import ProductAdminActions from "@/components/product/product-admin-actions";

export default function ProductList({
  products,
  page,
  limit,
  totalProductCount,
}: {
  products: Product[];
  page: number;
  totalProductCount: number;
  limit: number;
}) {
  const firstProductIndex = (page - 1) * limit + 1;
  const lastProductIndex = Math.min(page * limit, totalProductCount);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>
          Manage your products and view their sales performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="hidden md:table-cell">Quantity</TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="hidden sm:table-cell">
                  {product.images ? (
                    product.images.length > 0 && (
                      <Image
                        alt="Product image"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={product.images[0].url}
                        width="64"
                      />
                    )
                  ) : (
                    <Skeleton className="aspect-square rounded-md w-full h-full" />
                  )}
                </TableCell>
                <TableCell className="font-medium hover:underline">
                  <Link href={`/products/edit/${product.id}`}>
                    {product.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {product.state === "ACTIVE" ? "Active" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  ${product.price}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {product.variants
                    ? product.variants.reduce(
                        (acc, variant) => acc + variant.quantity,
                        0,
                      )
                    : product.quantity || 0}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {product.created && formatDate(product.created)}
                </TableCell>
                <TableCell>
                  <ProductAdminActions id={product.id} title={product.title} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing{" "}
          <strong>
            {firstProductIndex} - {lastProductIndex}
          </strong>{" "}
          of <strong>{totalProductCount}</strong> products
        </div>
      </CardFooter>
    </Card>
  );
}
