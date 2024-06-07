import { Product } from "@ditch/lib";
import Image from "next/image";

import Link from "@/components/navigation/link";
import ProductAdminActions from "@/components/product/product-admin-actions";
import { ProductBadge } from "@/components/product/product-badges";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { formatDateMedium } from "@/lib/utils";

function NoProducts() {
  return (
    <div className="flex flex-1 items-center justify-center h-64">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">No products found</h3>
        <p className="text-sm text-muted-foreground">
          Try changing the filters or add a new product.
        </p>
        <div
          className={
            "grid grid-cols-1 sm:grid-cols-2 items-center justify-center w-full gap-2"
          }
        >
          <Link href={`/products`}>
            <Button className="mt-4" size="sm" variant={"primary-outline"}>
              All products
            </Button>
          </Link>
          <Link href={`/products/create`}>
            <Button className="mt-4" size="sm" variant="default">
              New product
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProductList({
  products,
  page,
  limit,
  totalProductCount
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
        {totalProductCount === 0 ? (
          <NoProducts />
        ) : (
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
                <TableHead className="hidden md:table-cell">
                  Created at
                </TableHead>
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
                    <ProductBadge state={product.state} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    ${product.price}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {product.variants
                      ? product.variants.reduce(
                          (acc, variant) => acc + variant.quantity,
                          0
                        )
                      : product.quantity || 0}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {product.created && formatDateMedium(product.created)}
                  </TableCell>
                  <TableCell>
                    <ProductAdminActions
                      id={product.id}
                      title={product.title}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
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
