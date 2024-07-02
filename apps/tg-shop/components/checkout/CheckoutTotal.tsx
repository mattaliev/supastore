"use client";

import { useTranslations } from "next-intl";

export default function CheckoutTotal({
  totalQuantity,
  cartTotal,
  shippingPrice
}: {
  totalQuantity: number;
  cartTotal: number;
  shippingPrice?: number;
}) {
  const t = useTranslations("CartPage.CheckoutTotal");

  return (
    <div className={"grid gap-2"}>
      <div className={"grid gap-1"}>
        <div
          className={"flex justify-between text-sm text-telegram-hint-color"}
        >
          <p>{t("items", { count: totalQuantity })}</p>
          <p>${cartTotal}</p>
        </div>
        <div
          className={"flex justify-between text-sm text-telegram-hint-color"}
        >
          <p>{t("shipping")}</p>
          <p>${shippingPrice ? shippingPrice : "0.00"}</p>
        </div>
      </div>
      <div
        className={
          "flex justify-between text-base text-telegram-text-color font-semibold"
        }
      >
        <p>{t("total")}</p>
        <p>${shippingPrice ? shippingPrice + cartTotal : cartTotal}</p>
      </div>
    </div>
  );
}
