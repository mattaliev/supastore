import { storeLogoGet } from "@ditch/lib";

import CartIcon from "@/components/cart/cart-icon";
import Logo from "@/components/layout/logo";

async function Nav({ storeId }: { storeId: string }) {
  const { logoDark, logoLight } = await storeLogoGet({ storeId });

  return (
    <nav className="flex justify-between items-center p-4 bg-telegram-bg-color sticky top-0 z-10 w-full">
      <Logo
        logoDark={logoDark || undefined}
        logoLight={logoLight || undefined}
      />
      <CartIcon storeId={storeId} />
    </nav>
  );
}

export default Nav;
