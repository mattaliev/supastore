"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import OrderDeleteDrawerDialog from "@/components/order/order-delete-drawer-dialog";
import { useRouter } from "next/navigation";

export default function OrderDetailHeader({
  orderNumber,
  orderId,
}: {
  orderNumber: string;
  orderId: string;
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
        <OrderDeleteDrawerDialog orderId={orderId} />
      </div>
    </div>
  );
}
