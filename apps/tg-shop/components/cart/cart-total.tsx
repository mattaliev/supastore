import { getTranslations } from "next-intl/server";

export default async function CartTotal({
  totalQuantity,
  totalPrice
}: {
  totalQuantity: number;
  totalPrice: number;
}) {
  const t = await getTranslations("CartPage");

  return (
    <p className={"text-center text-telegram-hint-color text-sm"}>
      {t("cartTotalMessage", { count: totalQuantity })}
      <span className="text-telegram-text-color font-semibold text-lg">
        {" "}
        ${totalPrice}
      </span>
    </p>
  );
}
