import { ProductVariant } from "@ditch/lib";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

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
import { NoImage } from "@/components/ui/NoImage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { formatDateMedium } from "@/lib/utils";

async function NoProducts() {
  const t = await getTranslations("ProductListPage.NoProducts");

  return (
    <div className="flex flex-1 items-center justify-center h-64">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">{t("heading")}</h3>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
        <div
          className={
            "grid grid-cols-1 sm:grid-cols-2 items-center justify-center w-full gap-2"
          }
        >
          <Link href={`/products`}>
            <Button className="mt-4" size="sm" variant={"primary-outline"}>
              {t("allProductsButton")}
            </Button>
          </Link>
          <Link href={`/products/create`}>
            <Button className="mt-4" size="sm" variant="default">
              {t("newProductButton")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function ProductList({
  products,
  page,
  limit,
  totalProductCount
}: {
  products: ProductVariant[];
  page: number;
  totalProductCount: number;
  limit: number;
}) {
  const firstProductIndex = (page - 1) * limit + 1;
  const lastProductIndex = Math.min(page * limit, totalProductCount);
  const t = await getTranslations("ProductListPage");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {totalProductCount === 0 ? (
          <NoProducts />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">{t("ProductListTable.image")}</span>
                </TableHead>
                <TableHead>{t("ProductListTable.name")}</TableHead>
                <TableHead>{t("ProductListTable.status")}</TableHead>
                <TableHead className="hidden md:table-cell">
                  {t("ProductListTable.sku")}
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  {t("ProductListTable.brand")}
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  {t("ProductListTable.created-at")}
                </TableHead>
                <TableHead>
                  <span className="sr-only">
                    {t("ProductListTable.actions")}
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="hidden sm:table-cell">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        alt="Product image"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={product.images[0]}
                        width="64"
                      />
                    ) : (
                      <NoImage
                        iconSize={"xs"}
                        className="aspect-square rounded-md w-full"
                      />
                    )}
                  </TableCell>
                  <TableCell className="font-medium hover:underline">
                    <Link href={`/products/edit/${product.id}`}>
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <ProductBadge state={product.state} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {product.sku}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {product.brand}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {product.created && formatDateMedium(product.created)}
                  </TableCell>
                  <TableCell>
                    <ProductAdminActions id={product.id} title={product.name} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          {t("ProductListTable.Footer.showing")}{" "}
          <strong>
            {firstProductIndex} - {lastProductIndex}
          </strong>{" "}
          {t("ProductListTable.Footer.of")} <strong>{totalProductCount}</strong>{" "}
          {t("ProductListTable.Footer.products")}
        </div>
      </CardFooter>
    </Card>
  );
}
