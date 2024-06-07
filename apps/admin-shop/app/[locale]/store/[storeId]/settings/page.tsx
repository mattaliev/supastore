import { storeBotTokenGet, storeGet } from "@ditch/lib";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

import { authenticated } from "@/auth";
import WithAuth, { WithAuthProps } from "@/components/auth/with-auth";
import StoreBotToken from "@/components/store/store-bot-token";
import StoreInformation from "@/components/store/store-information";
import StoreLogo from "@/components/store/store-logo";

type SettingsPageProps = {
  params: {
    storeId: string;
  };
};

async function SettingsPage({
  params: { storeId },
  accessToken
}: WithAuthProps<SettingsPageProps>) {
  const locale = await getLocale();

  const [store, botToken] = await Promise.all([
    authenticated(accessToken, storeGet, {
      storeId
    }),
    authenticated(accessToken, storeBotTokenGet, {
      storeId
    })
  ]);

  if (!store) {
    redirect(`/${locale}/store`);
  }

  return (
    <div className="grid gap-3 w-full max-w-[59rem] mx-auto">
      <input type="hidden" name="store-id" value={store.id} />
      <StoreInformation store={store} />
      <StoreLogo store={store} />
      <StoreBotToken store={store} botToken={botToken} />
    </div>
  );
}

export default WithAuth<SettingsPageProps>(SettingsPage);
