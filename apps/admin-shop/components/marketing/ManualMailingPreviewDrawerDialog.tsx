import { ManualMailingPreviewInput } from "@ditch/lib";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { previewManualMailing } from "@/components/marketing/actions";
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
  const t = useTranslations("MarketingPage.ManualMailingPreview");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type={"button"}
            className={"w-full"}
            variant={"primary-outline"}
          >
            {t("title")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DrawerDescription>{t("description")}</DrawerDescription>
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
          {t("title")}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("title")}</DrawerTitle>
          <DrawerDescription>{t("description")}</DrawerDescription>
        </DrawerHeader>
        <ManualMailingPreview campaign={campaign} className={"px-4"} />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant={"primary-outline"}>{t("close")}</Button>
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
  const [formState, formAction] = useFormState(previewManualMailing, null);
  const t = useTranslations("MarketingPage.ManualMailingPreview.Form");

  return (
    <form className={cn("grid gap-4", className)} action={formAction}>
      <input type={"hidden"} name={"message"} value={campaign.message} />
      <input type={"hidden"} name={"cta-text"} value={campaign.ctaText} />
      <input type={"hidden"} name={"cta-url"} value={campaign.ctaUrl} />
      <div className={"flex items-center gap-2"}>
        <Checkbox id={"send-to-all-admins"} name={"send-to-all-admins"} />
        <Label htmlFor={"send-to-all-admins"}>
          {t("SendToAllAdmins.label")}
        </Label>
      </div>
      {formState?.formError && (
        <p className={"text-destructive text-xs"}>{formState.formError}</p>
      )}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("MarketingPage.ManualMailingPreview.Form");

  if (pending) {
    return (
      <Button
        className={"w-full flex items-center gap-2"}
        disabled
        type={"submit"}
      >
        <LoaderCircle className={"animate-spin"} />
        {t("sending")}
      </Button>
    );
  }

  return (
    <Button className={"w-full"} type={"submit"}>
      {t("previewCampaign")}
    </Button>
  );
}
