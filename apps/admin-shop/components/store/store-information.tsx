"use client";
import { Store } from "@ditch/lib";
import { Check, ChevronsUpDown, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { updateStore } from "@/components/store/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { timezones } from "@/lib/timezones";
import { cn } from "@/lib/utils";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("SettingsPage");

  if (pending) {
    return (
      <Button
        className={"flex justify-center items-center gap-2"}
        size={"sm"}
        variant={"default"}
        disabled
      >
        <LoaderCircle className={"animate-spin h-5 w-5"} />
        {t("savingChanges")}
      </Button>
    );
  }

  return (
    <Button variant={"default"} size={"sm"} type={"submit"}>
      {t("saveChanges")}
    </Button>
  );
}

export default function StoreInformation({ store }: { store: Store }) {
  const [formState, formAction] = useFormState(updateStore, null);
  const t = useTranslations("SettingsPage.StoreInformation");

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="store-name">
              {t("FormFields.storeName.label")}
            </Label>
            {formState?.fieldErrors && formState?.fieldErrors?.storeName && (
              <p className={"text-xs text-destructive text-start"}>
                {t("FormFields.storeName.error")}
              </p>
            )}
            <Input
              defaultValue={store.storeName}
              id="store-name"
              name="store-name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="store-description">
              {t("FormFields.storeDescription.label")}
            </Label>
            {formState?.fieldErrors &&
              formState?.fieldErrors?.storeDescription && (
                <p className={"text-xs text-destructive text-start"}>
                  {t("FormFields.storeDescription.error")}
                </p>
              )}
            <Textarea
              defaultValue={store.storeDescription || ""}
              id="store-description"
              name="store-description"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="store-timezone">
              {t("FormFields.storeTimezone.label")}
            </Label>
            {formState?.fieldErrors &&
              formState?.fieldErrors?.storeTimezone && (
                <p className={"text-xs text-destructive text-start"}>
                  {t("FormFields.storeTimezone.error")}
                </p>
              )}
            <TimezoneCombobox defaultTimezone={store.storeTimezone} />
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}

function TimezoneCombobox({ defaultTimezone }: { defaultTimezone?: string }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations(
    "SettingsPage.StoreInformation.FormFields.storeTimezone"
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {defaultTimezone
            ? timezones.find((timezone) => timezone.value === defaultTimezone)
                ?.name
            : t("selectTimezone")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={"p-0"}>
        <Command>
          <CommandInput placeholder={"Search timezone..."} />
          <CommandEmpty>{t("noTimezoneFound")}</CommandEmpty>
          <CommandGroup>
            {timezones.map((timezone) => (
              <CommandItem
                key={timezone.value}
                value={timezone.value}
                onSelect={(currentValue) => {
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    defaultTimezone === timezone.value
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {timezone.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
