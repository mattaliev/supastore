import { manualMailingListGet } from "@ditch/lib";

import { authenticated } from "@/auth";
import WithAuth, { WithAuthProps } from "@/components/auth/with-auth";
import ManualMailingForm from "@/components/marketing/ManualMailingCreate";
import ManualMailingsList from "@/components/marketing/ManualMailingsList";

type MarketingProps = {
  params: {
    storeId: string;
  };
};

async function MarketingPage({
  params: { storeId },
  accessToken
}: WithAuthProps<MarketingProps>) {
  const manualMailings = await authenticated(
    accessToken,
    manualMailingListGet,
    {
      storeId
    }
  );

  return (
    <div className={"grid max-w-[59rem] mx-auto w-full gap-4"}>
      <ManualMailingsList manualMailings={manualMailings} />
      <ManualMailingForm />
    </div>
  );
}

export default WithAuth<MarketingProps>(MarketingPage);
