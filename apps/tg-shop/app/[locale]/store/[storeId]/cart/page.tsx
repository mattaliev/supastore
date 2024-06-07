import { cartGet } from "@ditch/lib";
import { cookies } from "next/headers";

import CartItems from "@/components/cart/cart-items";
import CartTotal from "@/components/cart/cart-total";
import EmptyCart from "@/components/cart/empty-cart";
import CheckoutButton from "@/components/checkout/checkout-button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Добавить
 * Ты в нужном вермени, в нужном месте
 *
 * @constructor
 */
type CartPageProps = {
  params: {
    storeId: string;
  };
};

export default async function Cart({
  params: { storeId }
}: CartPageProps): Promise<JSX.Element> {
  const cartId = cookies().get("cartId")?.value;

  const cart = await cartGet({ cartId, storeId });

  if (!cart || cart.totalQuantity === 0) {
    return <EmptyCart />;
  }

  return (
    <Card className="bg-telegram-bg-color">
      <CardContent>
        <div className="grid gap-8">
          <CartTotal
            totalQuantity={cart.totalQuantity}
            totalPrice={cart.totalPrice}
          />
          <CartItems items={cart.items} />
        </div>
        <CheckoutButton />
      </CardContent>
    </Card>
  );
}
