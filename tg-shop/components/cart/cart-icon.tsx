import { cookies } from "next/headers";
import Link from "next/link";

import { cartGet } from "@/lib/api";

export default async function CartIcon() {
  const cartId = cookies().get("cartId")?.value;

  let cart;

  if (cartId) {
    cart = await cartGet(cartId);
  }

  return (
    <div className="flex items-center space-x-4 mr-4 relative">
      <Link href="/cart">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-telegram-text-color hover:text-telegram-button-color transition duration-300 ease-in-out"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
        {cart && cart?.totalQuantity > 0 && (
          <p className="absolute top-[-5px] right-[-5px] bg-telegram-button-color rounded-full w-4 h-4 text-center text-telegram-button-text-color text-xs">
            {cart.totalQuantity}
          </p>
        )}
      </Link>
    </div>
  );
}
