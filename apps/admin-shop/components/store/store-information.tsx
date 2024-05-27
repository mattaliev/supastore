"use client";
import { Store } from "@ditch/lib";
import { LoaderCircle } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function SubmitButton() {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <Button
        className={"flex justify-center items-center gap-2"}
        size={"sm"}
        variant={"default"}
        disabled
      >
        <LoaderCircle className={"animate-spin h-5 w-5"} />
        Saving Changes...
      </Button>
    );
  }

  return (
    <Button variant={"default"} size={"sm"} type={"submit"}>
      Save Changes
    </Button>
  );
}

export default function StoreInformation({ store }: { store: Store }) {
  const [formState, formAction] = useFormState(updateStore, null);

  return (
    <form action={formAction}>
      <Card>
        <input type="hidden" name="store-id" value={store.id} />
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>
            Update your store's name, description, and logo.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="store-name">Store Name</Label>
            {formState?.fieldErrors && formState?.fieldErrors?.storeName && (
              <p className={"text-xs text-destructive text-start"}>
                {formState.fieldErrors.storeName[0]}
              </p>
            )}
            <Input
              defaultValue={store.storeName}
              id="store-name"
              name="store-name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="store-description">Store Description</Label>
            {formState?.fieldErrors &&
              formState?.fieldErrors?.storeDescription && (
                <p className={"text-xs text-destructive text-start"}>
                  {formState.fieldErrors.storeDescription[0]}
                </p>
              )}
            <Textarea
              defaultValue={store.storeDescription || ""}
              id="store-description"
              name="store-description"
            />
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
