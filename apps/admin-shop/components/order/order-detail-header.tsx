"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import OrderDeleteDrawerDialog from "@/components/order/order-delete-drawer-dialog";
import { StoreProvider } from "@/components/store/store-context";
import { Button } from "@/components/ui/button";

export default function OrderDetailHeader({
  orderNumber,
  orderId,
  storeId
}: {
  orderNumber: string;
  orderId: string;
  storeId: string;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        type="button"
        onClick={() => router.back()}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Back</span>
      </Button>

      <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
        Order #{orderNumber}
      </h1>

      <div className={"hidden md:ml-auto md:flex items-center gap-2"}>
        <StoreProvider storeId={storeId}>
          <OrderDeleteDrawerDialog orderId={orderId} />
        </StoreProvider>
      </div>
    </div>
  );
}
