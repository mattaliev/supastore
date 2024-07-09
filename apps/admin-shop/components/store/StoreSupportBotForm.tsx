"use client";
import { StoreSupportBot } from "@ditch/lib";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { useFormState, useFormStatus } from "react-dom";

import { updateSupportBot } from "@/components/store/actions";
import StoreSupportBotChat from "@/components/store/StoreSupportBotChat";
import StoreSupportBotToken from "@/components/store/StoreSupportBotToken";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function StoreSupportBotForm({
  supportBot,
  supportBotToken
}: {
  supportBot?: StoreSupportBot;
  supportBotToken?: string;
}) {
  const [formState, formAction] = useFormState(updateSupportBot, null);
  const t = useTranslations("SettingsPage.StoreSupportBot.Form");

  return (
    <form className={"grid gap-4"} action={formAction}>
      <div className={"grid gap-2"}>
        <Label htmlFor={"support-bot-username"}>{t("BotUsername.label")}</Label>
        {formState?.fieldErrors?.botUsername && (
          <p className={"text-xs text-destructive text-start"}>
            {t("BotUsername.error")}
          </p>
        )}
        <Input
          type={"text"}
          id={"support-bot-username"}
          name={"support-bot-username"}
          placeholder={t("BotUsername.placeholder")}
          defaultValue={supportBot?.botUsername}
        />
      </div>
      <StoreSupportBotToken
        botToken={supportBotToken}
        fieldError={formState?.fieldErrors?.botToken}
      />
      <div className={"grid gap-2"}>
        <Label htmlFor={"support-bot-greeting-message"}>
          {t("GreetingMessage.label")}
        </Label>
        {formState?.fieldErrors?.greetingMessage && (
          <p className={"text-xs text-destructive text-start"}>
            {t("GreetingMessage.error")}
          </p>
        )}
        <Textarea
          id={"support-bot-greeting-message"}
          name={"support-bot-greeting-message"}
          placeholder={t("GreetingMessage.placeholder")}
          defaultValue={supportBot?.greetingMessage}
          className={"h-24"}
        />
      </div>
      <StoreSupportBotChat
        supportBot={supportBot}
        fieldError={formState?.fieldErrors?.messageLink}
      />
      {formState?.formError && (
        <p className={"text-xs text-destructive text-start"}>
          {t("formError")}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("SettingsPage.StoreSupportBot.Form");

  if (pending) {
    return (
      <Button
        className={"flex items-center gap-2 mr-auto"}
        disabled
        type={"submit"}
      >
        <LoaderCircle className={"animate-spin"} />
        {t("saving")}
      </Button>
    );
  }

  return (
    <Button className={"mr-auto"} type={"submit"}>
      {t("saveChanges")}
    </Button>
  );
}
