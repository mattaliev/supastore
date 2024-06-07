import { CartItem } from "@ditch/lib";

import RemoveFromCartButton from "@/components/cart/remove-from-cart-button";
import UpdateItemQuantitySelect from "@/components/cart/update-quantity-select";

export default function CartItemQuantity({
  item
}: {
  item: CartItem;
}): JSX.Element {
  return (
    <div className="flex items-center gap-1">
      <div className="text-sm text-telegram-text-color">Quantity</div>
      <UpdateItemQuantitySelect itemId={item.id} quantity={item.quantity} />
      <RemoveFromCartButton itemId={item.id} quantity={item.quantity} />
    </div>
  );
}
