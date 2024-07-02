import { useHapticFeedback } from "@tma.js/sdk-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { createShippingAddress } from "@/components/checkout/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddressCreateDrawer({
  selectedPlace
}: {
  selectedPlace: google.maps.places.PlaceResult | null;
}) {
  const hapticFeedback = useHapticFeedback();
  const t = useTranslations("ShippingCreatePage");

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          onClick={(e) =>
            selectedPlace
              ? hapticFeedback.impactOccurred("medium")
              : hapticFeedback.notificationOccurred("error")
          }
        >
          {t("select")}
        </Button>
      </DrawerTrigger>
      <DrawerContent
        className={"bg-telegram-bg-color text-telegram-text-color border-none"}
      >
        {selectedPlace ? (
          <>
            <DrawerHeader>
              <DrawerTitle className={"text-start"}>
                {selectedPlace?.formatted_address}
              </DrawerTitle>
            </DrawerHeader>
            <AddressCreateForm selectedPlace={selectedPlace} />
            <DrawerFooter className={"-mt-2"}>
              <DrawerClose asChild>
                <Button variant={"outline"}>{t("close")}</Button>
              </DrawerClose>
            </DrawerFooter>
          </>
        ) : (
          <>
            <DrawerHeader>
              <DrawerTitle>{t("pleaseSelectAddress")}</DrawerTitle>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant={"outline"}>{t("close")}</Button>
              </DrawerClose>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}

function SubmitButton() {
  const hapticFeedback = useHapticFeedback();
  const { pending } = useFormStatus();
  const t = useTranslations("ShippingCreatePage");

  if (pending) {
    return (
      <Button
        type={"submit"}
        disabled={true}
        className={"flex items-center gap-2 justify-center"}
      >
        <AiOutlineLoading3Quarters className={"animate-spin"} />
        {t("adding")}
      </Button>
    );
  }

  return (
    <Button
      type={"submit"}
      onClick={() => hapticFeedback.impactOccurred("medium")}
    >
      {t("add")}
    </Button>
  );
}

function AddressCreateForm({
  selectedPlace
}: {
  selectedPlace: google.maps.places.PlaceResult;
}) {
  const [formError, formAction] = useFormState(createShippingAddress, null);
  const hapticFeedback = useHapticFeedback();
  const t = useTranslations("ShippingCreatePage.CreateForm");

  useEffect(() => {
    if (formError) hapticFeedback.notificationOccurred("error");
  }, [formError]);

  return (
    <form className={"px-4 grid gap-6"} action={formAction}>
      <input
        type="hidden"
        name="address"
        value={selectedPlace.formatted_address}
      />
      <div className={"flex items-center justify-start gap-3"}>
        <div className={"flex flex-col gap-1"}>
          <Label htmlFor={"house-number"}>{t("houseNumber.label")}</Label>
          {formError && formError.fieldErrors?.houseNumber && (
            <p className={"text-telegram-destructive-text-color text-sm"}>
              {formError.fieldErrors.houseNumber}
            </p>
          )}
          <div className={"flex gap-4 items-center"}>
            <Input
              type={"number"}
              id={"house-number"}
              name={"house-number"}
              className={
                "bg-telegram-bg-color text-telegram-text-color text-base"
              }
              placeholder={t("houseNumber.placeholder")}
            />
            <div className={"flex gap-2 w-full"}>
              <Checkbox
                className={"border-telegram-text-color"}
                name={"private-house"}
              />
              <Label htmlFor={"private-house"}>{t("privateHouse.label")}</Label>
            </div>
          </div>
        </div>
      </div>
      <h3 className={"text-base font-semibold"}>
        {t("additionalInfoMessage")}
      </h3>
      <div className={"flex items-end justify-start gap-3"}>
        <div className={"flex flex-col gap-1"}>
          <Label htmlFor={"floor"}>{t("floor.label")}</Label>
          <Input
            type={"number"}
            id={"floor"}
            name={"floor"}
            className={
              "bg-telegram-bg-color text-telegram-text-color text-base"
            }
            placeholder={t("floor.placeholder")}
          />
        </div>
        <div className={"flex flex-col gap-1"}>
          <Label htmlFor={"entrance"}>{t("entrance.label")}</Label>
          <Input
            type={"number"}
            id={"entrance"}
            name={"entrance"}
            className={
              "bg-telegram-bg-color text-telegram-text-color text-base"
            }
            placeholder={t("entrance.placeholder")}
          />
        </div>
        <div className={"flex flex-col gap-1"}>
          <Label htmlFor={"intercom"}>{t("intercom.label")}</Label>
          <Input
            type={"number"}
            id={"intercom"}
            name={"intercom"}
            className={
              "bg-telegram-bg-color text-telegram-text-color text-base"
            }
            placeholder={t("intercom.placeholder")}
          />
        </div>
      </div>
      <SubmitButton />
    </form>
  );
}
