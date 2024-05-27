import { storeCheckpointsGet } from "@ditch/lib";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import React from "react";

import { authenticated, authOptions } from "@/auth";
import DashboardTimeline from "@/components/dashboard/dashboard-timeline";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  params: {
    storeId: string;
  };
};

export default async function DashboardPage({
  params: { storeId },
}: DashboardPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    redirect("/auth/signIn");
  }

  const storeCheckpoints = await authenticated(
    session.user.accessToken,
    storeCheckpointsGet,
    {
      storeId,
    },
  );

  if (!storeCheckpoints) {
    return null;
  }

  return (
    <div className="max-w-[59rem] mx-auto grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="md:col-span-2 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>
                Welcome to your store dashboard. Here you can manage your
                products, orders, customers, and more.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Store Sessions This Week</CardDescription>
            <CardTitle className={"text-4xl"}>240</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={"text-muted-foreground text-xs"}>
              +25% from last week
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Store Sessions This Month</CardDescription>
            <CardTitle className={"text-4xl"}>240</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={"text-muted-foreground text-xs"}>
              +25% from last week
            </div>
          </CardContent>
        </Card>
      </div>
      <DashboardTimeline
        adminCheckpoints={storeCheckpoints}
        storeId={storeId}
      />
    </div>
  );
}
