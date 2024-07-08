"use client";
import { ManualMailingPreviewInput } from "@ditch/lib";
import { useState } from "react";

import ManualMailingCreateForm from "@/components/marketing/ManualMailingCreateForm";
import ManualMailingPreviewDrawerDialog from "@/components/marketing/ManualMailingPreviewDrawerDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default function ManualMailingCreate() {
  const [campaign, setCampaign] = useState<Partial<ManualMailingPreviewInput>>({
    message: "",
    ctaText: "",
    ctaUrl: ""
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Campaign</CardTitle>
        <CardDescription>
          Create a new campaign to send your customers a message in-app.
        </CardDescription>
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
