"use client";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { createStoreApplication } from "@/components/store/actions";
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
        className={"flex justify-center items-center gap-2 w-full"}
        size={"sm"}
        variant={"default"}
        disabled
      >
        <LoaderCircle className={"animate-spin h-5 w-5"} />
        Submitting Application...
      </Button>
    );
  }

  return (
    <Button
      variant={"default"}
      size={"sm"}
      type={"submit"}
      className={"w-full"}
    >
      Submit Application
    </Button>
  );
}

export default function StoreCreatePage() {
  const [formState, formAction] = useFormState(createStoreApplication, null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const categories = [
    "Clothing and Accessories",
    "Electronics and Gadgets",
    "Beauty and Personal Care",
    "Digital Products and Services",
    "Education and Online Courses",
    "Other"
  ];

  const handleSelectedCategory = (category: string) => {
    if (category !== "Other") {
      setCategory(category);
      setSelectedCategory(category);
    } else {
      setCategory(null);
      setSelectedCategory(category);
    }
  };

  return (
    <form
      className={
        "grid h-[80vh] justify-stretch m-4 lg:mx-auto max-w-[59rem] items-center "
      }
      action={formAction}
    >
      <Card className={"w-full border"}>
        <CardHeader>
          <CardTitle>Create Your Store In Telegram</CardTitle>
          <CardDescription>
            We are currently in beta, so we can't accept all stores. Please,
            start by filling out an application and we will let you know as soon
            as we can onboard you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={"grid gap-4"}>
            <div className={"grid gap-2"}>
              <Label htmlFor={"store-name"}>Store Name</Label>
              {formState?.fieldErrors && formState?.fieldErrors.storeName && (
                <p className={"text-destructive text-xs text-start"}>
                  {formState?.fieldErrors.storeName}
                </p>
              )}
              <Input
                type={"text"}
                id={"store-name"}
                name={"store-name"}
                placeholder={"Enter your store name"}
              />
            </div>
            <div className={"grid gap-2"}>
              <Label htmlFor={"store-description"}>Store Description</Label>
              {formState?.fieldErrors &&
                formState?.fieldErrors.storeDescription && (
                  <p className={"text-destructive text-xs text-start"}>
                    {formState?.fieldErrors.storeDescription}
                  </p>
                )}
              <Textarea
                id={"store-description"}
                name={"store-description"}
                placeholder={"Enter description for your store"}
              />
            </div>
            <div className={"grid gap-2"}>
              <Label htmlFor={"channels"}>Telegram Channels (Optional)</Label>
              {formState?.fieldErrors && formState?.fieldErrors.channels && (
                <p className={"text-destructive text-xs text-start"}>
                  {formState?.fieldErrors.channels}
                </p>
              )}
              <Input
                type={"text"}
                name={"channels"}
                id={"channels"}
                placeholder={"Enter your telegram channels, separated by comma"}
              />
            </div>
            <div className={"grid gap-3"}>
              <Label htmlFor={"product-category"}>
                Please select products you are planning to sell
              </Label>
              {formState?.fieldErrors &&
                formState?.fieldErrors.productCategory && (
                  <p className={"text-destructive text-xs text-start"}>
                    {formState?.fieldErrors.productCategory}
                  </p>
                )}
              <div
                className={
                  "grid gap-2 grid-cols-1 md:grid-cols-3 lg:grid-cols-6"
                }
              >
                {categories.map((category) => (
                  <div
                    className={
                      "border rounded-xl grid items-center justify-center cursor-pointer" +
                      (selectedCategory === category ? " border-primary" : "")
                    }
                    key={category}
                    onClick={() => handleSelectedCategory(category)}
                  >
                    <div
                      className={
                        "p-2 text-sm text-center text-muted-foreground"
                      }
                    >
                      {category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {selectedCategory === "Other" && (
              <div className={"grid gap-2"}>
                <Label htmlFor={"other-category"}>Other Category</Label>
                <Input
                  type={"text"}
                  id={"other-category"}
                  placeholder={"Enter other category"}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            )}
            <input
              type={"hidden"}
              name={"product-category"}
              value={category || ""}
            />
          </div>
        </CardContent>
        <CardFooter>
          {formState?.formError && (
            <p className={"text-destructive text-xs text-start"}>
              {formState?.formError}
            </p>
          )}
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
