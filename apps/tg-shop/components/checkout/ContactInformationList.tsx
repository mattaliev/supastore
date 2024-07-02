"use client";
import { ContactInformation } from "@ditch/lib";
import { useHapticFeedback } from "@tma.js/sdk-react";
import { MoreHorizontal, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { setDefaultContactInformation } from "@/components/checkout/actions";
import ContactInformationDeleteDialog from "@/components/checkout/ContactInformationDeleteDialog";
import CreateContactInformation from "@/components/checkout/CreateContactInformation";
import Link from "@/components/navigation/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ContactInformationList({
  contacts
}: {
  contacts: ContactInformation[];
}) {
  const [contactInfoToDelete, setContactInfoToDelete] = useState<string | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const hapticFeedback = useHapticFeedback();
  const [formState, formAction] = useFormState(
    setDefaultContactInformation,
    null
  );

  const t = useTranslations("ContactInfoPage");

  useEffect(() => {
    if (formState?.formError) hapticFeedback.notificationOccurred("error");
  }, [formState?.formError]);

  return (
    <>
      <form
        className={
          "flex flex-col min-h-[100vh] justify-between items-start p-4"
        }
        action={formAction}
      >
        <div className={"grid gap-4 w-full"}>
          <div className={"flex flex-row items-center justify-between"}>
            <h1 className={"text-telegram-text-color text-lg font-semibold"}>
              {t("title")}
            </h1>
            <Link href={"/cart"}>
              <Button size={"icon"} variant={"ghost"} className={"w-6 h-6"}>
                <XIcon className={"w-6 h-6 text-telegram-hint-color"} />
              </Button>
            </Link>
          </div>
          <RadioGroup
            name={"contact-information-id"}
            defaultValue={contacts[0].id}
            onValueChange={(value) => hapticFeedback.impactOccurred("light")}
          >
            {contacts.map((contact) => (
              <div key={contact.id} className={"relative w-full"}>
                <RadioGroupItem
                  value={contact.id}
                  id={contact.id}
                  className="peer sr-only"
                  aria-label={contact.id}
                />
                <Label
                  htmlFor={contact.id}
                  className="flex flex-col items-start justify-between rounded-md border-2 border-telegram-hint-color w-full px-4 py-4 gap-1 hover:bg-telegram-bg-color/90 peer-data-[state=checked]:border-telegram-button-color [&:has([data-state=checked])]:border-telegram-button-color"
                >
                  <p className="text-telegram-text-color">{contact.name}</p>
                  <p className="text-telegram-hint-color">{contact.email}</p>
                  <p className="text-telegram-hint-color">{contact.phone}</p>
                </Label>
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  className={"absolute top-0 right-0 text-telegram-text-color"}
                  type={"button"}
                  onClick={() => {
                    setContactInfoToDelete(contact.id);
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
          {formState && formState.formError && (
            <p className={"text-telegram-destructive-text-color text-sm"}>
              {t("selectContactInfoError")}
            </p>
          )}
          <SubmitButton />
          <Button
            className={"w-full"}
            variant={"outline"}
            type={"button"}
            onClick={(e) => {
              hapticFeedback.impactOccurred("light");
              setDrawerOpen(true);
            }}
          >
            {t("addContactInfo")}
          </Button>
        </div>
      </form>
      <ContactInformationDeleteDialog
        id={contactInfoToDelete}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <CreateContactInformation
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </>
  );
}

function SubmitButton() {
  const hapticFeedback = useHapticFeedback();
  const { pending } = useFormStatus();
  const t = useTranslations("ContactInfoPage");

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
      onClick={() => hapticFeedback.impactOccurred("light")}
      type={"submit"}
    >
      {t("select")}
    </Button>
  );
}
