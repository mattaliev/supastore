import { cookies } from "next/headers";

import CartItems from "@/components/cart/cart-items";
import CartTotal from "@/components/cart/cart-total";
import EmptyCart from "@/components/cart/empty-cart";
import FinalizeButton from "@/components/checkout/checkout-button";
import { Card, CardContent } from "@/components/ui/card";
import { cartGet } from "@/lib/api";

export default async function Cart(): Promise<JSX.Element> {
  const cartId = cookies().get("cartId")?.value;

  const cart = await cartGet(cartId);

  if (!cart || cart.totalQuantity === 0) {
    return <EmptyCart />;
  }

  return (
    <Card className="bg-telegram-bg-color pt-20 min-h-screen">
      <CardContent>
        <div className="grid gap-8">
          <CartTotal
            totalQuantity={cart.totalQuantity}
            totalPrice={cart.totalPrice}
          />
          <CartItems items={cart.items} />
        </div>
        <FinalizeButton />
      </CardContent>
    </Card>
  );
}
