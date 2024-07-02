"use client";
import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import StateFilter from "@/components/filters/state-filter";
import Link from "@/components/navigation/link";
import { Button } from "@/components/ui/button";

export default function ProductFilters() {
  const t = useTranslations("ProductListPage");

  return (
    <div className="flex items-center">
      <StateFilter />
      <div className="ml-auto flex items-center gap-2">
        {/* TODO: Implement product import */}
        {/*<Button size="sm" variant="outline" className="h-8 gap-1">*/}
        {/*  <File className="h-3.5 w-3.5" />*/}
        {/*  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">*/}
        {/*    Import*/}
        {/*  </span>*/}
        {/*</Button>*/}
        <Link href={`/products/create`}>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              {t("addProduct")}
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
