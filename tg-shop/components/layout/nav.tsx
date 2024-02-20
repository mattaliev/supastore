import CartIcon from "@/components/cart/cart-icon";
import Logo from "@/components/layout/logo";

function Nav() {
  return (
    <nav className="flex justify-between items-center p-4 bg-telegram-bg-color fixed z-10 w-full">
      <Logo />
      <CartIcon />
    </nav>
  );
}

export default Nav;
