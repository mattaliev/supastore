import { shippingAddressList } from "@ditch/lib";

import WithAuth, { WithAuthProps } from "@/components/auth/WithAuth";
import NoShippingAddresses from "@/components/checkout/NoShippingAddresses";
import ShippingAddressSelectForm from "@/components/checkout/ShippingAddressSelectForm";
import { getStoreId } from "@/components/store/getStoreId";
import { tmaAuthenticated } from "@/lib/auth";

async function ShippingAddressesPage({ initDataRaw }: WithAuthProps<{}>) {
  // TODO: Get user shipping addresses
  const storeId = await getStoreId();
  const shippingAddresses = await tmaAuthenticated(
    initDataRaw,
    storeId,
    shippingAddressList,
    {
      storeId
    }
  );
  if (!shippingAddresses || shippingAddresses.length === 0) {
    return <NoShippingAddresses />;
  }

  return <ShippingAddressSelectForm shippingAddresses={shippingAddresses} />;
}

export default WithAuth(ShippingAddressesPage);
