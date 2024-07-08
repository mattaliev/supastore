import { ManualMailingPreviewInput } from "@ditch/lib";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function ManualMailingPreviewDrawerDialog({
  campaign
}: {
  campaign: Partial<ManualMailingPreviewInput>;
}) {
  const isDesktop =
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : false;
  const [open, setOpen] = useState<boolean>(false);
  const t = useTranslations("PaymentSystemsPage.UpdatePaymentSystem");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type={"button"}
            className={"w-full"}
            variant={"primary-outline"}
          >
            Preview Campaign
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preview Campaign</DialogTitle>
            <DrawerDescription>
              Preview your campaign in the app, and send it to your customers
            </DrawerDescription>
          </DialogHeader>
          <ManualMailingPreview campaign={campaign} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          type={"button"}
          className={"w-full"}
          variant={"primary-outline"}
        >
          Preview Campaign
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Preview Campaign</DrawerTitle>
          <DrawerDescription>
            Preview your campaign in the app before sending it to your customers
          </DrawerDescription>
        </DrawerHeader>
        <ManualMailingPreview campaign={campaign} className={"px-4"} />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant={"primary-outline"}>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ManualMailingPreview({
  campaign,
  className
}: {
  campaign: Partial<ManualMailingPreviewInput>;
  className?: string;
}) {
  return (
    <form className={cn("grid gap-4", className)}>
      <input type={"hidden"} name={"store-id"} value={"123"} />
      <input type={"hidden"} name={"message"} value={campaign.message} />
      <input type={"hidden"} name={"cta-text"} value={campaign.ctaText} />
      <input type={"hidden"} name={"cta-url"} value={campaign.ctaUrl} />
      <div className={"flex items-center gap-2"}>
        <Checkbox id={"send-to-all-admins"} name={"send-to-all-admins"} />
        <Label htmlFor={"send-to-all-admins"}>Send to all store admins?</Label>
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <Button
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
    <Button className={"w-full"} type={"submit"}>
      Preview Campaign
    </Button>
  );
}
