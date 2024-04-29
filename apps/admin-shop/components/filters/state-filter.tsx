"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StateFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  let defaultValue;

  if (!searchParams.get("state")) {
    defaultValue = "all";
  } else if (searchParams.get("state") === "ACTIVE") {
    defaultValue = "active";
  } else {
    defaultValue = "draft";
  }

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete("state");
    }

    if (value === "active") {
      params.set("state", "ACTIVE");
    }

    if (value === "draft") {
      params.set("state", "INACTIVE");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Tabs defaultValue={defaultValue} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="draft">Draft</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
