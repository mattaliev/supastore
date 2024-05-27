import { storeBotTokenGet, storeGet } from "@ditch/lib";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authenticated, authOptions } from "@/auth";
import StoreUpdateForm from "@/components/store/store-update-form";

type SettingsPageProps = {
  params: {
    storeId: string;
  };
};

export default async function SettingsPage({
  params: { storeId },
}: SettingsPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    redirect("/auth/signIn");
  }

  const store = await authenticated(session.user.accessToken, storeGet, {
    storeId,
  });

  if (!store) {
    redirect("/store");
  }

  const botToken = await authenticated(
    session.user.accessToken,
    storeBotTokenGet,
    {
      storeId,
    },
  );

  return <StoreUpdateForm store={store} botToken={botToken} />;
}
