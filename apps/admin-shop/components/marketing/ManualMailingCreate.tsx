"use client";
import { ManualMailingPreviewInput } from "@ditch/lib";
import { useTranslations } from "next-intl";
import { useState } from "react";

import ManualMailingCreateForm from "@/components/marketing/ManualMailingCreateForm";
import ManualMailingPreviewDrawerDialog from "@/components/marketing/ManualMailingPreviewDrawerDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ManualMailingCreate() {
  const [campaign, setCampaign] = useState<Partial<ManualMailingPreviewInput>>({
    message: "",
    ctaText: "",
    ctaUrl: "",
  });
  const t = useTranslations("MarketingPage.ManualMailingCreate");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className={"grid gap-4"}>
        <ManualMailingCreateForm
          campaign={campaign}
          setCampaign={setCampaign}
        />
        <ManualMailingPreviewDrawerDialog campaign={campaign} />
      </CardContent>
    </Card>
  );
}
