"use client";
import { EntityState, Paginated, ProductVariant } from "@ditch/lib";
import { DndContext, UniqueIdentifier } from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";

import Link from "@/components/navigation/link";
import {
  useProductInfiniteScroll,
  useProductListDragAndDrop
} from "@/components/product/hooks";
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

function NoProducts() {
  const t = useTranslations("ProductListPage.NoProducts");

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

export default function ProductList({
  page,
  limit,
  totalProductCount,
  paginatedProducts,
  state
}: {
  paginatedProducts: Paginated<ProductVariant>;
  page: number;
  totalProductCount: number;
  limit: number;
  state: EntityState;
}) {
  const t = useTranslations("ProductListPage");
  const { products, setProducts, lastElementRef, isFetching, isLoading } =
    useProductInfiniteScroll({
      state: EntityState[state as keyof typeof EntityState],
      paginatedProducts,
      page,
      limit
    });
  const { sensors, handleDrag } = useProductListDragAndDrop({
    products,
    setProducts
  });

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
                <TableHead className="w-[20px] table-cell"></TableHead>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">{t("ProductListTable.image")}</span>
                </TableHead>
                <TableHead>{t("ProductListTable.name")}</TableHead>
                <TableHead className={"hidden sm:table-cell"}>
                  {t("ProductListTable.status")}
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  {t("ProductListTable.sku")}
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  {t("ProductListTable.brand")}
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  {t("ProductListTable.created-at")}
                </TableHead>
                <TableHead>
                  <span className="sr-only">
                    {t("ProductListTable.actions")}
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <DndContext
              id={"sortable-collection-products"}
              modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
              sensors={sensors}
              onDragEnd={handleDrag}
            >
              <SortableContext
                items={products}
                strategy={verticalListSortingStrategy}
              >
                <TableBody>
                  {products.map((product) => (
                    <TableProduct
                      key={product.id}
                      product={product}
                      id={product.id}
                      lastElementRef={lastElementRef}
                    />
                  ))}
                  {(isFetching || isLoading) && (
                    <TableRow>
                      <TableCell colSpan={8} className={"text-center"}>
                        <div
                          className={
                            "flex items-center justify-center w-full text-primary"
                          }
                        >
                          <div className={"animate-spin"}>
                            <LoaderCircle className={"h-6 w-6"} />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </SortableContext>
            </DndContext>
          </Table>
        )}
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          {t("ProductListTable.Footer.showing")}{" "}
          <strong>
            {1} - {products.length}
          </strong>{" "}
          {t("ProductListTable.Footer.of")} <strong>{totalProductCount}</strong>{" "}
          {t("ProductListTable.Footer.products")}
        </div>
      </CardFooter>
    </Card>
  );
}

function TableProduct({
  product,
  id,
  lastElementRef
}: {
  product: ProductVariant;
  id: UniqueIdentifier;
  lastElementRef: (node: HTMLTableCellElement) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const format = useFormatter();

  return (
    <TableRow key={product.id} ref={setNodeRef} style={style}>
      <TableCell className="table-cell" ref={lastElementRef}>
        <div
          ref={setActivatorNodeRef}
          {...listeners}
          {...attributes}
          className="cursor-move"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </TableCell>
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
        <Link href={`/products/edit/${product.id}`}>{product.name}</Link>
      </TableCell>
      <TableCell className={"hidden sm:table-cell"}>
        <ProductBadge state={product.state} />
      </TableCell>
      <TableCell className="hidden md:table-cell">{product.sku}</TableCell>
      <TableCell className="hidden lg:table-cell">{product.brand}</TableCell>
      <TableCell className="hidden lg:table-cell">
        {product.created &&
          format.dateTime(new Date(product.created), {
            year: "numeric",
            month: "short",
            day: "numeric"
          })}
      </TableCell>
      <TableCell>
        <ProductAdminActions id={product.id} title={product.name} />
      </TableCell>
    </TableRow>
  );
}
