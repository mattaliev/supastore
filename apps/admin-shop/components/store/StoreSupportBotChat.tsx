"use client";
import { StoreSupportBot } from "@ditch/lib";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StoreSupportBotChat({
  supportBot,
  fieldError
}: {
  supportBot?: StoreSupportBot;
  fieldError?: string[];
}) {
  const [isChanging, setIsChanging] = useState(false);
  const t = useTranslations(
    "SettingsPage.StoreSupportBot.Form.SupportBotGroupChat"
  );

  if (!supportBot || !supportBot.groupChatId) {
    return (
      <div className={"grid gap-4"}>
        <div>
          <CardTitle className={"text-lg font-base"}>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </div>
        <div className={"grid gap-2"}>
          <Label htmlFor={"support-bot-token"}>{t("MessageLink.label")}</Label>

          <p className={"text-xs text-muted-foreground"}>
            {t("MessageLink.description")}
          </p>
          {fieldError && (
            <p className={"text-xs text-destructive text-start"}>
              {t("MessageLink.error")}
            </p>
          )}
          <Input
            type={"text"}
            id={"support-bot-message-link"}
            name={"support-bot-message-link"}
            placeholder={t("MessageLink.placeholder")}
          />
        </div>
        <div className={"flex gap-2 items-center"}>
          <Checkbox
            id={"support-bot-is-forum"}
            name={"support-bot-is-forum"}
            defaultChecked={false}
          />
          <Label
            htmlFor={"support-bot-is-forum"}
            className={"text-sm text-muted-foreground"}
          >
            {t("IsForum.label")}
          </Label>
        </div>
      </div>
    );
  }

  if (isChanging) {
    return (
      <div className={"grid gap-4"}>
        <div>
          <CardTitle className={"text-lg font-base"}>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </div>
        <div className={"grid gap-2"}>
          <Label htmlFor={"support-bot-message-link"}>
            {t("MessageLink.label")}
          </Label>
          {fieldError && (
            <p className={"text-xs text-destructive text-start"}>
              {t("MessageLink.error")}
            </p>
          )}
          <p className={"text-xs text-muted-foreground"}>
            {t("MessageLink.description")}
          </p>
          <Input
            type={"text"}
            id={"support-bot-message-link"}
            name={"support-bot-message-link"}
            placeholder={t("MessageLink.placeholder")}
          />
        </div>
        <div className={"flex gap-2 items-center"}>
          <Checkbox
            id={"support-bot-is-forum"}
            name={"support-bot-is-forum"}
            defaultChecked={false}
          />
          <Label
            htmlFor={"support-bot-is-forum"}
            className={"text-sm text-muted-foreground"}
          >
            {t("IsForum.label")}
          </Label>
        </div>
        <Button
          size={"sm"}
          variant={"primary-outline"}
          className={"ml-auto"}
          onClick={() => setIsChanging(false)}
          type={"button"}
        >
          {t("cancel")}
        </Button>
      </div>
    );
  }

  return (
    <div className={"grid gap-4"}>
      <div>
        <CardTitle className={"text-lg font-base"}>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </div>
      <div className={"grid gap-2"}>
        <Label htmlFor={"support-bot-group-chat-id"}>
          {t("GroupChatId.label")}
        </Label>
        <Input
          disabled
          type={"text"}
          id={"support-bot-group-chat-id"}
          name={"support-bot-group-chat-id"}
          value={supportBot.groupChatId}
          className={"text-muted-foreground bg-muted"}
        />
      </div>
      <div className={"grid gap-2"}>
        <Label htmlFor={"support-bot-message-thread-id"}>
          {t("GroupTopicId.label")}
        </Label>
        <Input
          disabled
          type={"text"}
          id={"support-bot-message-thread-id"}
          name={"support-bot-message-thread-id"}
          value={supportBot.messageThreadId}
          className={"text-muted-foreground bg-muted"}
        />
      </div>
      <Button
        size={"sm"}
        variant={"primary-outline"}
        className={"ml-auto"}
        type={"button"}
        onClick={() => setIsChanging(true)}
      >
        {t("change")}
      </Button>
    </div>
  );
}
