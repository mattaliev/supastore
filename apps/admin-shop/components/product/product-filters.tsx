"use client";
import { File, PlusCircle } from "lucide-react";
import Link from "next/link";

import StateFilter from "@/components/filters/state-filter";
import { Button } from "@/components/ui/button";

export default function ProductFilters() {
  return (
    <div className="flex items-center">
      <StateFilter />
      <div className="ml-auto flex items-center gap-2">
        <Button size="sm" variant="outline" className="h-8 gap-1">
          <File className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Import
          </span>
        </Button>
        <Link href="/products/create">
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
