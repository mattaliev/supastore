"use client";
import { Store } from "@ditch/lib";
import { CheckIcon, CopyIcon, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useFormState, useFormStatus } from "react-dom";

import { updateStore } from "@/components/store/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <Button
        className={"flex justify-center items-center gap-2"}
        size={"sm"}
        disabled
      >
        <LoaderCircle className={"animate-spin h-5 w-5"} />
        Saving Changes...
      </Button>
    );
  }

  return (
    <Button size={"sm"} type={"submit"}>
      Save Changes
    </Button>
  );
}

export default function StoreBotToken({
  store,
  botToken,
}: {
  store: Store;
  botToken?: string | null;
}) {
  const [urlCopied, setUrlCopied] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [formState, formAction] = useFormState(updateStore, null);
  return (
    <form action={formAction}>
      <Card>
        <input type={"hidden"} name={"store-id"} value={store.id} />
        <CardHeader>
          <CardTitle>Telegram Bot</CardTitle>
          <CardDescription>
            Connect Telegram Bot to your store to be able interact with users.
            Learn more on how to get token here.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className={"grid gap-2"}>
            <Label htmlFor={"store-url"}>Store URL</Label>
            <p className="text-muted-foreground text-xs">
              Learn more on how to connect your store to telegram
            </p>
            <div className={"relative"}>
              <Input
                disabled
                type={"text"}
                className={
                  "bg-muted text-muted-foreground pr-10 bg-opacity-100"
                }
                id={"store-url"}
                value={store.storeUrl}
              />
              <div className={"absolute top-2.5 right-2.5"}>
                <CopyToClipboard
                  text={store.storeUrl}
                  onCopy={() => setUrlCopied(true)}
                >
                  {urlCopied ? (
                    <CheckIcon className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                  ) : (
                    <CopyIcon className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                  )}
                </CopyToClipboard>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bot-username">Telegram Bot Username</Label>
            {formState?.fieldErrors && formState.fieldErrors?.botUsername && (
              <p className={"text-xs text-destructive text-start"}>
                {formState.fieldErrors.botUsername[0]}
              </p>
            )}
            <Input
              id="bot-username"
              name="bot-username"
              type={"text"}
              placeholder={"Enter your Telegram Bot username"}
              defaultValue={store.botUsername || ""}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bot-token">Telegram Bot API Key</Label>
            {formState?.fieldErrors && formState.fieldErrors?.botToken && (
              <p className={"text-xs text-destructive text-start"}>
                {formState.fieldErrors.botToken[0]}
              </p>
            )}
            <div className={"relative"}>
              <Input
                id="bot-token"
                name="bot-token"
                type={hidden ? "password" : "text"}
                placeholder={"Enter your Telegram Bot API key"}
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
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
