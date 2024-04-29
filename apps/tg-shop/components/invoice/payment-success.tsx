"use client";
import { Order } from "@ditch/lib";
import { useHapticFeedback } from "@tma.js/sdk-react";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentSuccessIcon } from "@/components/ui/icons";

export default function PaymentSuccess({ order }: { order: Order }) {
  const hapticFeedback = useHapticFeedback();

  useEffect(() => {
    hapticFeedback.notificationOccurred("success");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6 md:space-y-10 px-4 text-center md:px-6">
      <div className="flex flex-col items-center space-y-2">
        <PaymentSuccessIcon
          className="h-12 w-12 rounded-full text-telegram-text-color"
          id="checkmark"
        />
        <div
          className="space-y-2 opacity-0 animate-fade-in"
          style={{ animationDelay: "1.5s" }}
        >
          <h1 className="font-bold text-3xl tracking-tighter text-telegram-text-color">
            Payment successful
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-telegram-text-color">
            Thank you for your purchase
          </p>
        </div>
      </div>
      <Card
        className="w-full max-w-sm animate-fade-in opacity-0"
        style={{ animationDelay: "2s" }}
      >
        <CardContent>
          <div className="grid gap-3 text-left text-sm px-4">
            <div className="flex justify-between items-end">
              <div
                className={"text-telegram-text-color text-base font-semibold"}
              >
                Order number
              </div>
              <div className="text-telegram-text-color">
                {order.orderNumber}
              </div>
            </div>
            <div className="grid gap-1.5 items-start">
              <div className="text-telegram-text-color text-base font-semibold">
                Items
              </div>
              {order.cart.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div className="text-telegram-text-color">
                    {item.product.title}{" "}
                    {item.variant?.size ? item.variant?.size : ""}
                  </div>
                  <div className="font-medium text-telegram-text-color">
                    x{item.quantity}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-end">
              <div className="text-telegram-text-color text-base font-semibold">
                Total
              </div>
              <div className="text-telegram-text-color">
                ${order.totalAmount}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Link href="/">
        <Button
          className="text-telegram-button-text-color bg-telegram-button-color animate-fade-in opacity-0"
          style={{ animationDelay: "2s" }}
          onClick={() => hapticFeedback.impactOccurred("light")}
        >
          Continue shopping
        </Button>
      </Link>
    </div>
  );
}
