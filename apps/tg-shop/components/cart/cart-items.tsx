import { CartItem } from "@ditch/lib";
import Image from "next/image";

import CartItemQuantity from "@/components/cart/cart-item-quantity";

export default function CartItems({
  items
}: {
  items: CartItem[];
}): JSX.Element {
  return (
    <>
      {items.map((item) => (
        <>
          <div key={item.id} className={"flex items-start gap-4"}>
            <Image
              src={
                item.product.images
                  ? item.product.images[0].url
                  : "/assets/no-photo.png"
              }
              alt={item.product.title}
              width={140}
              height={140}
              className={"aspect-square rounded-lg object-cover"}
            />
            <div className="grid gap-1.5">
              <div className="font-semibold text-telegram-text-color">
                {item.product.title}
              </div>
              {item.variant && (
                <div className="text-sm text-telegram-hint-color">
                  Size: {item.variant.size}
                </div>
              )}
              <div className="font-semibold text-telegram-text-color">
                ${item.product.price}
              </div>
              <CartItemQuantity item={item} />
            </div>
          </div>
        </>
      ))}
    </>
  );
}
