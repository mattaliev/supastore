"use client";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("StoreCreatePage");

  if (pending) {
    return (
      <Button
        className={"flex justify-center items-center gap-2 w-full"}
        size={"sm"}
        variant={"default"}
        disabled
      >
        <LoaderCircle className={"animate-spin h-5 w-5"} />
        {t("submittingApplication")}
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
      {t("submitApplication")}
    </Button>
  );
}

export default function StoreCreatePage() {
  const [formState, formAction] = useFormState(createStoreApplication, null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const t = useTranslations("StoreCreatePage");

  const categories = [
    t("FormFields.productCategory.categories.clothingAndAccessories"),
    t("FormFields.productCategory.categories.electronicsAndGadgets"),
    t("FormFields.productCategory.categories.beachAndBody"),
    t("FormFields.productCategory.categories.digitalProductsAndServices"),
    t("FormFields.productCategory.categories.educationAndOnlineCourses"),
    t("FormFields.productCategory.categories.other")
  ];

  const handleSelectedCategory = (category: string) => {
    if (category !== t("FormFields.productCategory.categories.other")) {
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
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={"grid gap-4"}>
            <div className={"grid gap-2"}>
              <Label htmlFor={"store-name"}>
                {t("FormFields.storeName.label")}
              </Label>
              {formState?.fieldErrors && formState?.fieldErrors.storeName && (
                <p className={"text-destructive text-xs text-start"}>
                  {t("FormFields.storeName.error")}
                </p>
              )}
              <Input
                type={"text"}
                id={"store-name"}
                name={"store-name"}
                placeholder={t("FormFields.storeName.placeholder")}
              />
            </div>
            <div className={"grid gap-2"}>
              <Label htmlFor={"store-description"}>
                {t("FormFields.storeDescription.label")}
              </Label>
              {formState?.fieldErrors &&
                formState?.fieldErrors.storeDescription && (
                  <p className={"text-destructive text-xs text-start"}>
                    {t("FormFields.storeDescription.error")}
                  </p>
                )}
              <Textarea
                id={"store-description"}
                name={"store-description"}
                placeholder={t("FormFields.storeDescription.placeholder")}
              />
            </div>
            <div className={"grid gap-2"}>
              <Label htmlFor={"channels"}>
                {t("FormFields.telegramChannels.label")}
              </Label>
              {formState?.fieldErrors && formState?.fieldErrors.channels && (
                <p className={"text-destructive text-xs text-start"}>
                  {t("FormFields.telegramChannels.error")}
                </p>
              )}
              <Input
                type={"text"}
                name={"channels"}
                id={"channels"}
                placeholder={t("FormFields.telegramChannels.placeholder")}
              />
            </div>
            <div className={"grid gap-3"}>
              <Label htmlFor={"product-category"}>
                {t("FormFields.productCategory.label")}
              </Label>
              {formState?.fieldErrors &&
                formState?.fieldErrors.productCategory && (
                  <p className={"text-destructive text-xs text-start"}>
                    {t("FormFields.productCategory.error")}
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
            {selectedCategory ===
              t("FormFields.productCategory.categories.other") && (
              <div className={"grid gap-2"}>
                <Label htmlFor={"other-category"}>
                  {t("FormFields.productCategory.otherCategory.label")}
                </Label>
                <Input
                  type={"text"}
                  id={"other-category"}
                  placeholder={t(
                    "FormFields.productCategory.otherCategory.placeholder"
                  )}
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
              {t("FormFields.formError")}
            </p>
          )}
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
