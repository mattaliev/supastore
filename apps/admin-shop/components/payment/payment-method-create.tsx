"use client";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import Link from "@/components/navigation/link";
import { createPaymentMethod } from "@/components/payment/actions";
import PaymentMethodFields from "@/components/payment/payment-method-fields";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("PaymentSystemsPage.CreatePaymentSystem");

  if (pending) {
    return (
      <Button
        className={"cursor-not-allowed flex items-center gap-1 w-full"}
        disabled
        onClick={(e) => e.preventDefault()}
      >
        <LoaderCircle className="animate-spin" />
        {t("creatingPaymentMethod")}
      </Button>
    );
  }

  return (
    <Button size="sm" type={"submit"} className={"w-full"}>
      {t("createPaymentMethod")}
    </Button>
  );
}

export default function PaymentMethodCreate() {
  const [provider, setProvider] = useState<string | null>(null);
  const [formState, formAction] = useFormState(createPaymentMethod, null);
  const t = useTranslations("PaymentSystemsPage.CreatePaymentSystem");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          {t("description") + " "}
          <Link
            href={
              "https://guides.ditch-concept.com/pages/connect-payment-gateway"
            }
            inStore={false}
            localized={false}
            className={"underline hover:text-primary hover:no-underline"}
          >
            {t("guide")}
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className="grid gap-4">
            <PaymentMethodFields
              fieldErrors={formState?.fieldErrors}
              provider={provider}
              setProvider={setProvider}
            />
            {formState?.formError && (
              <p className="text-destructive text-xs">{t("error")}</p>
            )}
            {provider && <SubmitButton />}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
