"use client";

import { ProductVariantCharacteristic } from "@ditch/lib";
import { useLocale, useTranslations } from "next-intl";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

export default function ProductCharacteristics({
  characteristics
}: {
  characteristics: ProductVariantCharacteristic[];
}) {
  const t = useTranslations("ProductDetailPage");

  if (characteristics.length < 1) {
    return null;
  }

  const locale = useLocale();

  return (
    <Accordion type={"multiple"} className={"grid gap-2"}>
      <AccordionItem
        value={"characteristics"}
        title={"All Characteristics"}
        className={"border-none"}
      >
        <AccordionTrigger className={"text-telegram-text-color text-lg p-0"}>
          {t("characteristics")}
        </AccordionTrigger>
        <AccordionContent className={"pt-2 pb-0"}>
          <div className={"grid gap-1"}>
            {characteristics.map(
              ({ characteristic: { nameEn, nameRu }, value, id }) => {
                if (value.length > 0 && value[0] !== "") {
                  return (
                    <div
                      key={id}
                      className={"flex gap-4 justify-between items-center"}
                    >
                      <h2 className="text-sm font-semibold text-telegram-text-color">
                        {locale === "ru" ? nameRu : nameEn}
                      </h2>
                      <p className="text-telegram-hint-color">
                        {value.join(", ")}
                      </p>
                    </div>
                  );
                }
                return null;
              }
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
