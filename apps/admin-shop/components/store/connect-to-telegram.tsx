"use client";

import { LoaderCircle } from "lucide-react";
import React from "react";
import { useFormState, useFormStatus } from "react-dom";

import { connectToTelegram } from "@/components/store/actions";
import { Button } from "@/components/ui/button";

function SubmitButton() {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <Button
        size={"sm"}
        className={"flex items-center justify-center gap-2"}
        disabled
      >
        <LoaderCircle size={16} className={"animate-spin"} />
        Marking as Done...
      </Button>
    );
  }

  return (
    <Button
      size={"sm"}
      type={"submit"}
      className={"flex items-center justify-center gap-2"}
    >
      Mark as Done
    </Button>
  );
}

export default function MarkConnectToTelegramAsDone({
  storeId
}: {
  storeId: string;
}) {
  const [formState, formAction] = useFormState(connectToTelegram, null);
  const actionWithStoreId = formAction.bind(null, storeId);

  return (
    <form action={actionWithStoreId} className={"mt-2"}>
      <SubmitButton />
    </form>
  );
}
