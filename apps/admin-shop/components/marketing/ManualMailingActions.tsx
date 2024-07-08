"use client";
import { ManualMailingStatus } from "@ditch/lib";
import { LoaderCircle, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { sendManualMailing } from "@/components/marketing/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function ManualMailingActions({
  status,
  mailingId
}: {
  status: ManualMailingStatus;
  mailingId: string;
}) {
  const [formState, formAction] = useFormState(sendManualMailing, null);
  const [open, setOpen] = useState(false);

  if (status === ManualMailingStatus.SENT) {
    return (
      <Button variant={"ghost"} size={"icon"} disabled>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4">
        <DropdownMenuItem>
          <form action={formAction} className={"w-full"}>
            <input type={"hidden"} name={"mailing-id"} value={mailingId} />
            <SubmitButton setOpen={setOpen} />
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SubmitButton({ setOpen }: { setOpen: (open: boolean) => void }) {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <Button
        size={"sm"}
        variant={"ghost"}
        className={"w-full flex items-center gap-2"}
        disabled
        type={"submit"}
      >
        <LoaderCircle className={"animate-spin"} />
        Sending...
      </Button>
    );
  }

  return (
    <Button
      className={"w-full"}
      type={"submit"}
      size={"sm"}
      variant={"ghost"}
      onClick={() => setOpen(true)}
    >
      Send
    </Button>
  );
}
