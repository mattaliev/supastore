"use client";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StoreSupportBotToken({
  botToken,
  fieldError
}: {
  botToken?: string;
  fieldError?: string[];
}) {
  const [hidden, setHidden] = useState(true);
  const t = useTranslations("SettingsPage.StoreSupportBot.Form");

  return (
    <div className={"grid gap-2"}>
      <Label htmlFor={"support-bot-token"}>{t("BotToken.label")}</Label>
      {fieldError && (
        <p className={"text-xs text-destructive text-start"}>
          {t("BotToken.error")}
        </p>
      )}
      <div className={"relative"}>
        <Input
          id="support-bot-token"
          name="support-bot-token"
          type={hidden ? "password" : "text"}
          placeholder={t("BotToken.placeholder")}
          defaultValue={botToken || ""}
          className={"pr-10"}
        />
        <div className={"absolute right-2.5 top-2.5"}>
          {hidden && (
            <EyeOff
              className={
                "h-5 w-5 text-muted-foreground hover:text-accent-foreground"
              }
              onClick={() => setHidden(false)}
            />
          )}
          {!hidden && (
            <Eye
              className={
                "h-5 w-5 text-muted-foreground hover:text-accent-foreground"
              }
              onClick={() => setHidden(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
