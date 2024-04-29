"use client";
import { useUtils } from "@tma.js/sdk-react";

import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "@/components/ui/icons";

export default function PaymentFailed() {
  const utils = useUtils();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center py-12 px-4 space-y-4 md:px-6 md:space-y-8">
      <div className="text-center">
        <AlertTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
        <h1 className="font-bold text-3xl mt-4 text-telegram-text-color">
          Payment failed
        </h1>
        <p className="mt-2 text-sm text-telegram-hint-color">
          We couldn&apos;t process your payment. Please try again or contact
          support.
        </p>
      </div>
      <div className="grid gap-4">
        <Button size="lg">Retry payment</Button>
      </div>
    </div>
  );
}
