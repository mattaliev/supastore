"use client";
import { ManualMailingPreviewInput } from "@ditch/lib";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormState, useFormStatus } from "react-dom";

import { createManualMailing } from "@/components/marketing/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ManualMailingCreateForm({
  campaign,
  setCampaign
}: {
  campaign: Partial<ManualMailingPreviewInput>;
  setCampaign: (campaign: Partial<ManualMailingPreviewInput>) => void;
}) {
  const t = useTranslations("MarketingPage.ManualMailingCreate");
  const [formState, formAction] = useFormState(createManualMailing, null);

  return (
    <form className={"grid gap-4"} action={formAction}>
      <div className={"grid gap-2"}>
        <Label htmlFor={"name"}>{t("Form.Name.label")}</Label>
        {formState?.fieldErrors?.name && (
          <p className={"text-destructive text-xs"}>{t("Form.Name.error")}</p>
        )}
        <Input
          type={"text"}
          id={"name"}
          name={"name"}
          placeholder={t("Form.Name.placeholder")}
        />
      </div>
      <div className={"grid gap-2"}>
        <Label htmlFor={"message"}>{t("Form.Message.label")}</Label>
        {formState?.fieldErrors?.message && (
          <p className={"text-destructive text-xs"}>
            {t("Form.Message.error")}
          </p>
        )}
        <Textarea
          id={"message"}
          name={"message"}
          className={"h-36"}
          onChange={(e) =>
            setCampaign({ ...campaign, message: e.target.value })
          }
          placeholder={t("Form.Message.placeholder")}
        />
      </div>
      <div className={"grid gap-2"}>
        <Label htmlFor={"audience"}>{t("Form.Audience.label")}</Label>
        <p className={"text-muted-foreground text-sm"}>
          {t("Form.Audience.description")}
        </p>
        {formState?.fieldErrors?.audience && (
          <p className={"text-destructive text-xs"}>
            {t("Form.Audience.error")}
          </p>
        )}
        <div className={"grid gap-1"}>
          <div className={"flex items-center gap-2"}>
            <Checkbox id={"all"} name={"audience"} value={"ALL"} />
            <Label className={"text-sm text-muted-foreground"} htmlFor={"all"}>
              {t("Form.Audience.all")}
            </Label>
          </div>
          <div className={"flex items-center gap-2"}>
            <Checkbox id={"new"} name={"audience"} value={"NEW"} />
            <Label htmlFor={"new"} className={"text-sm text-muted-foreground"}>
              {t("Form.Audience.new")}
            </Label>
          </div>
          <div className={"flex items-center gap-2"}>
            <Checkbox
              id={"added-to-cart"}
              name={"audience"}
              value={"ADDED_TO_CART"}
            />
            <Label
              htmlFor={"added-to-cart"}
              className={"text-sm text-muted-foreground"}
            >
              {t("Form.Audience.addedToCart")}
            </Label>
          </div>
          <div className={"flex items-center gap-2"}>
            <Checkbox
              id={"started-checkout"}
              name={"audience"}
              value={"STARTED_CHECKOUT"}
            />
            <Label
              htmlFor={"started-checkout"}
              className={"text-sm text-muted-foreground"}
            >
              {t("Form.Audience.startedCheckout")}
            </Label>
          </div>
          <div className={"flex items-center gap-2"}>
            <Checkbox id={"purchased"} name={"audience"} value={"PURCHASED"} />
            <Label
              htmlFor={"purchased"}
              className={"text-sm text-muted-foreground"}
            >
              {t("Form.Audience.purchased")}
            </Label>
          </div>
        </div>
      </div>
      <div className={"grid gap-2"}>
        <Label htmlFor={"cta-text"}>{t("Form.CallToActionText.label")}</Label>
        {formState?.fieldErrors?.ctaText && (
          <p className={"text-destructive text-xs"}>
            {t("Form.CallToActionText.error")}
          </p>
        )}
        <Input
          type={"text"}
          id={"cta-text"}
          name={"cta-text"}
          onChange={(e) =>
            setCampaign({ ...campaign, ctaText: e.target.value })
          }
          placeholder={t("Form.CallToActionText.placeholder")}
        />
      </div>
      <div className={"grid gap-2"}>
        <Label htmlFor={"cta-url"}>{t("Form.CallToActionUrl.label")}</Label>
        {formState?.fieldErrors?.ctaUrl && (
          <p className={"text-destructive text-xs"}>
            {t("Form.CallToActionUrl.error")}
          </p>
        )}
        <Input
          type={"text"}
          id={"cta-url"}
          name={"cta-url"}
          onChange={(e) => setCampaign({ ...campaign, ctaUrl: e.target.value })}
          placeholder={t("Form.CallToActionUrl.placeholder")}
        />
      </div>
      <div className={"grid gap-2"}>
        <Label htmlFor={"execute-immediately"}>
          {t("Form.SendImmediately.label")}
        </Label>
        <div className={"flex items-center gap-2"}>
          <Checkbox
            id={"execute-immediately"}
            name={"execute-immediately"}
            defaultChecked={false}
          />
          <Label
            className={"text-muted-foreground text-sm"}
            htmlFor={"execute-immediately"}
          >
            {t("Form.SendImmediately.description")}
          </Label>
        </div>
      </div>
      <div className={"grid gap-2"}>
        {formState?.formError && (
          <p className={"text-destructive text-xs"}>{t("Form.formError")}</p>
        )}
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("MarketingPage.ManualMailingCreate.Form");

  if (pending) {
    return (
      <Button
        className={"w-full flex items-center gap-2"}
        disabled
        type={"submit"}
      >
        <LoaderCircle className={"animate-spin"} />
        {t("creatingCampaign")}
      </Button>
    );
  }

  return (
    <Button className={"w-full"} type={"submit"}>
      {t("createCampaign")}
    </Button>
  );
}
