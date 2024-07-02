import { cartGet, orderCanCreate } from "@ditch/lib";
import { cookies } from "next/headers";

import { getInitDataRaw } from "@/components/auth/getInitDataRaw";
import CartItems from "@/components/cart/cart-items";
import CartTotal from "@/components/cart/cart-total";
import EmptyCart from "@/components/cart/empty-cart";
import CheckoutFields from "@/components/checkout/CheckoutFields";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { tmaAuthenticated } from "@/lib/auth";

type CartPageProps = {
  params: {
    storeId: string;
  };
};

export default async function Cart({
  params: { storeId }
}: CartPageProps): Promise<JSX.Element> {
  const cartId = cookies().get("cartId")?.value;
  const initDataRaw = await getInitDataRaw();

  if (!cartId) {
    return <EmptyCart />;
  }

  const cart = await cartGet({ cartId, storeId });

  if (!cart || cart.totalQuantity === 0) {
    return <EmptyCart />;
  }

  const canCheckout = await tmaAuthenticated(
    initDataRaw,
    storeId,
    orderCanCreate,
    {
      cartId: cartId as string,
      storeId
    }
  );

  return (
    <div className={"grid gap-6 p-6"}>
      <CartTotal
        totalQuantity={cart.totalQuantity}
        totalPrice={cart.totalPrice}
      />
      <CartItems items={cart.items} />
      <CheckoutForm
        canCheckout={canCheckout}
        cartTotal={cart.totalPrice}
        cartQuantity={cart.totalQuantity}
      >
        <CheckoutFields />
      </CheckoutForm>
    </div>
  );
}
