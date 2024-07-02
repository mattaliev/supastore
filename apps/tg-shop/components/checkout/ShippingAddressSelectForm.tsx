"use client";
import { ShippingAddress } from "@ditch/lib";
import { useHapticFeedback } from "@tma.js/sdk-react";
import { MoreHorizontal, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { setDefaultShippingAddress } from "@/components/checkout/actions";
import ShippingAddressDeleteDialog from "@/components/checkout/ShippingAddressDeleteDialog";
import Link from "@/components/navigation/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ShippingAddressSelectForm({
  shippingAddresses
}: {
  shippingAddresses: ShippingAddress[];
}) {
  const hapticFeedback = useHapticFeedback();
  const [formError, formAction] = useFormState(setDefaultShippingAddress, null);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const t = useTranslations("ShippingPage");

  useEffect(() => {
    if (formError) hapticFeedback.notificationOccurred("error");
  }, [formError]);

  return (
    <>
      <form
        action={formAction}
        className={
          "flex flex-col min-h-[100vh] justify-between items-start p-4"
        }
      >
        <div className={"grid gap-4 w-full"}>
          <div className={"flex flex-row items-center justify-between"}>
            <h1 className={"text-telegram-text-color text-lg font-semibold"}>
              {t("title")}
            </h1>
            <Link href={"/cart"}>
              <Button
                size={"icon"}
                variant={"ghost"}
                className={"w-6 h-6"}
                type={"button"}
              >
                <XIcon className={"w-6 h-6 text-telegram-hint-color"} />
              </Button>
            </Link>
          </div>
          <RadioGroup
            name={"shipping-address-id"}
            defaultValue={shippingAddresses[0].id}
            onValueChange={(value) => hapticFeedback.impactOccurred("light")}
          >
            {shippingAddresses.map((address, index) => (
              <div key={address.id} className={"relative w-full"}>
                <RadioGroupItem
                  value={address.id}
                  id={address.id}
                  className="peer sr-only"
                  aria-label={`Address ${index}`}
                />
                <Label
                  htmlFor={address.id}
                  className="flex flex-col items-center justify-between rounded-md border-2 border-telegram-hint-color w-full p-4 pr-6 hover:bg-telegram-bg-color/90 peer-data-[state=checked]:border-telegram-button-color [&:has([data-state=checked])]:border-telegram-button-color"
                >
                  <p className="text-telegram-text-color">{address.address}</p>
                </Label>
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  type={"button"}
                  className={"absolute top-0 right-0 text-telegram-text-color"}
                  onClick={() => {
                    hapticFeedback.impactOccurred("light");
                    setAddressToDelete(address.id);
                    setDialogOpen(true);
                  }}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className={"w-full grid gap-2"}>
          {formError && (
            <p className={"text-telegram-destructive-text-color text-sm"}>
              {formError}
            </p>
          )}
          <SubmitButton />
          <Link href={"/shipping/create"}>
            <Button
              className={"w-full"}
              variant={"outline"}
              onClick={(e) => hapticFeedback.impactOccurred("light")}
              type={"button"}
            >
              {t("addShippingAddress")}
            </Button>
          </Link>
        </div>
      </form>
      <ShippingAddressDeleteDialog
        id={addressToDelete}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  const hapticFeedback = useHapticFeedback();
  const t = useTranslations("ShippingPage");

  if (pending) {
    return (
      <Button
        className={"w-full flex items-center justify-center gap-2"}
        disabled
        type={"submit"}
      >
        <AiOutlineLoading3Quarters className={"animate-spin"} />
        {t("selecting")}
      </Button>
    );
  }

  return (
    <Button
      className={"w-full"}
      type={"submit"}
      onClick={() => hapticFeedback.impactOccurred("medium")}
    >
      {t("select")}
    </Button>
  );
}
