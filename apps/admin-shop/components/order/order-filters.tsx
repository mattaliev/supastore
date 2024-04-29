"use client";
import { ListFilter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function OrderFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  let defaultValue;

  if (
    !searchParams.get("payment_status") &&
    !searchParams.get("fulfilment_status")
  ) {
    defaultValue = "all";
  }

  if (searchParams.get("payment_status")) {
    defaultValue = searchParams.get("payment_status")?.toLowerCase();
  }

  if (searchParams.get("fulfilment_status")) {
    defaultValue = searchParams.get("fulfilment_status")?.toLowerCase();
  }

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete("payment_status");
      params.delete("fulfilment_status");
    }

    if (
      value === "unfulfilled" ||
      value === "fulfilled" ||
      value === "tracking" ||
      value === "pending" ||
      value === "open"
    ) {
      params.delete("payment_status");
      params.set("fulfilment_status", value.toUpperCase());
    }

    if (value === "paid") {
      params.delete("fulfilment_status");
      params.set("payment_status", value.toUpperCase());
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <div className="items-center hidden sm:flex">
        <Tabs defaultValue={defaultValue} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="fulfilled">Fulfilled</TabsTrigger>
            <TabsTrigger value="tracking">Out for Delivery</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex sm:hidden items-center ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size="icon">
              <ListFilter className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Filter
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-4">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <Separator />
            <DropdownMenuItem onClick={() => handleTabChange("all")}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTabChange("pending")}>
              Pending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTabChange("paid")}>
              Paid
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTabChange("unfulfilled")}>
              Open
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTabChange("fulfilled")}>
              Fulfilled
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTabChange("tracking")}>
              Out for Delivery
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
