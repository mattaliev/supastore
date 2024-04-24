"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
      value === "tracking"
    ) {
      params.delete("payment_status");
      params.set("fulfilment_status", value.toUpperCase());
    }

    if (value === "pending" || value === "paid") {
      params.delete("fulfilment_status");
      params.set("payment_status", value.toUpperCase());
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center">
      <Tabs defaultValue={defaultValue} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="unfulfilled">Open</TabsTrigger>
          <TabsTrigger value="fulfilled">Fulfilled</TabsTrigger>
          <TabsTrigger value="tracking">Out for Delivery</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
