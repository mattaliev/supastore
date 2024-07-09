import { Store, storeSupportBotTokenGet } from "@ditch/lib";
import { getTranslations } from "next-intl/server";
import React from "react";

import { authenticated } from "@/auth";
import { getAccessToken } from "@/components/auth/get-token";
import StoreSupportBotForm from "@/components/store/StoreSupportBotForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default async function StoreSupportBotSection({
  store
}: {
  store: Store;
}) {
  const accessToken = await getAccessToken();
  const supportBotToken = await authenticated(
    accessToken,
    storeSupportBotTokenGet,
    {
      storeId: store.id
    }
  );
  const t = await getTranslations("SettingsPage.StoreSupportBot");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <StoreSupportBotForm
          supportBot={store.supportBot}
          supportBotToken={supportBotToken}
        />
      </CardContent>
    </Card>
  );
}
