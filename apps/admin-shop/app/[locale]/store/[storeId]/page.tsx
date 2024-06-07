import { sessionAnalyticsGet, storeCheckpointsGet } from "@ditch/lib";
import { getTranslations } from "next-intl/server";
import React from "react";

import { authenticated } from "@/auth";
import WithAuth, { WithAuthProps } from "@/components/auth/with-auth";
import DashboardTimeline from "@/components/dashboard/dashboard-timeline";
import { getStoreId } from "@/components/store/helpers";
import StoreSessions from "@/components/store/store-sessions";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams: {
    date?: string;
  };
};

async function DashboardPage({
  searchParams: { date },
  accessToken
}: WithAuthProps<DashboardPageProps>) {
  const t = await getTranslations("Dashboard");
  const storeId = getStoreId();

  const [storeCheckpoints, storeSessions] = await Promise.all([
    await authenticated(accessToken, storeCheckpointsGet, {
      storeId
    }),
    await authenticated(accessToken, sessionAnalyticsGet, {
      storeId,
      date
    })
  ]);

  return (
    <div className="max-w-[59rem] mx-auto grid gap-4">
      <h1 className={"text-2xl font-semibold pl-6 leading-none tracking-tight"}>
        {t("title")}
      </h1>
      <StoreSessions selectedDate={date} storeSessions={storeSessions} />
      <DashboardTimeline adminCheckpoints={storeCheckpoints} />
    </div>
  );
}

export default WithAuth<DashboardPageProps>(DashboardPage);
