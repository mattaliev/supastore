export default function CartTotal({
  totalQuantity,
  totalPrice
}: {
  totalQuantity: number;
  totalPrice: number;
}) {
  return (
    <p className={"text-center text-telegram-hint-color text-sm"}>
      {totalQuantity} items. Total (excluding delivery)
      <span className="text-telegram-text-color font-semibold text-lg">
        {" "}
        ${totalPrice}
      </span>
    </p>
  );
}
