import { contactInformationDefaultGet } from "@ditch/lib";
import { getTranslations } from "next-intl/server";

import WithAuth, { WithAuthProps } from "@/components/auth/WithAuth";
import Link from "@/components/navigation/link";
import { getStoreId } from "@/components/store/getStoreId";
import { tmaAuthenticated } from "@/lib/auth";

async function CheckoutContactInformation({ initDataRaw }: WithAuthProps<{}>) {
  const storeId = await getStoreId();
  const t = await getTranslations("CartPage");
  const contactInformation = await tmaAuthenticated(
    initDataRaw,
    storeId,
    contactInformationDefaultGet,
    {
      storeId
    }
  );

  if (!contactInformation) {
    return (
      <div className={"flex items-start justify-start"}>
        <Link
          href={"/contact-info"}
          className={"text-telegram-button-color underline"}
        >
          {t("createNewContactInfo")}
        </Link>
      </div>
    );
  }

  return (
    <div className={"flex items-start justify-start"}>
      <dt className={"text-telegram-hint-color not-italic text-sm"}>
        <dd>{contactInformation.name}</dd>
        <dd>{contactInformation.email}</dd>
        <dd>{contactInformation.phone}</dd>
      </dt>
    </div>
  );
}

export default WithAuth<{}>(CheckoutContactInformation);
