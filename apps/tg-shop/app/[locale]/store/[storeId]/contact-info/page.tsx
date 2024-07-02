import { contactInformationList } from "@ditch/lib";

import WithAuth, { WithAuthProps } from "@/components/auth/WithAuth";
import ContactInformationList from "@/components/checkout/ContactInformationList";
import NoContactInformation from "@/components/checkout/NoContactInformation";
import { getStoreId } from "@/components/store/getStoreId";
import { tmaAuthenticated } from "@/lib/auth";

async function ContactInformationPage({ initDataRaw }: WithAuthProps<{}>) {
  const storeId = await getStoreId();

  const contacts = await tmaAuthenticated(
    initDataRaw,
    storeId,
    contactInformationList,
    {
      storeId
    }
  );

  if (!contacts || contacts.length === 0) {
    return <NoContactInformation />;
  }

  return <ContactInformationList contacts={contacts} />;
}

export default WithAuth<{}>(ContactInformationPage);
