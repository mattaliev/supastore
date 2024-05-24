import { CartItem } from "@ditch/lib";

import RemoveFromCartButton from "@/components/cart/remove-from-cart-button";
import UpdateItemQuantitySelect from "@/components/cart/update-quantity-select";
import { StoreProvider } from "@/components/store/store-context";

export default function CartItemQuantity({
  item,
  storeId
}: {
  item: CartItem;
  storeId: string;
}): JSX.Element {
  return (
    <div className="flex items-center gap-1">
      <div className="text-sm text-telegram-text-color">Quantity</div>
      <StoreProvider storeId={storeId}>
        <UpdateItemQuantitySelect itemId={item.id} quantity={item.quantity} />
        <RemoveFromCartButton itemId={item.id} quantity={item.quantity} />
      </StoreProvider>
    </div>
  );
}
