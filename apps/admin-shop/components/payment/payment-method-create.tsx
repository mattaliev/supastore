"use client";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { createPaymentMethod } from "@/components/payment/actions";
import PaymentMethodFields from "@/components/payment/payment-method-fields";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function SubmitButton() {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <Button
        className={"cursor-not-allowed flex items-center gap-1 w-full"}
        disabled
        onClick={(e) => e.preventDefault()}
      >
        <LoaderCircle className="animate-spin" />
        Adding Payment Gateway...
      </Button>
    );
  }

  return (
    <Button size="sm" type={"submit"} className={"w-full"}>
      Add Payment Gateway
    </Button>
  );
}

export default function PaymentMethodCreate() {
  const [provider, setProvider] = useState<string | null>(null);
  const [formState, formAction] = useFormState(createPaymentMethod, null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Payment Gateway</CardTitle>
        <CardDescription>
          Learn more about connecting payment gateways
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
              <p className="text-destructive text-xs">{formState.formError}</p>
            )}
            {provider && <SubmitButton />}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
