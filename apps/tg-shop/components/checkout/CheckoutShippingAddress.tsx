import { shippingAddressDefaultGet } from "@ditch/lib";
import { getTranslations } from "next-intl/server";

import WithAuth, { WithAuthProps } from "@/components/auth/WithAuth";
import Link from "@/components/navigation/link";
import { getStoreId } from "@/components/store/getStoreId";
import { tmaAuthenticated } from "@/lib/auth";

async function CheckoutShippingAddress({ initDataRaw }: WithAuthProps<{}>) {
  const storeId = await getStoreId();
  const t = await getTranslations("CartPage");
  const defaultShippingAddress = await tmaAuthenticated(
    initDataRaw,
    storeId,
    shippingAddressDefaultGet,
    {
      storeId
    }
  );

  if (!defaultShippingAddress) {
    return (
      <div className={"flex items-start justify-start"}>
        <Link
          href={"/shipping"}
          className={"text-telegram-button-color underline"}
        >
          {t("createNewShippingAddress")}
        </Link>
      </div>
    );
  }

  return (
    <div className={"flex flex-col items-start justify-start"}>
      <address className="text-telegram-hint-color not-italic text-sm">
        <dd>{defaultShippingAddress.address}</dd>
        <dd>{defaultShippingAddress.additionalInfo}</dd>
      </address>
    </div>
  );
}

export default WithAuth<{}>(CheckoutShippingAddress);
