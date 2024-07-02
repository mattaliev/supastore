import { Category, Characteristic, ProductVariant } from "@ditch/lib";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useCategoryCharacteristics } from "@/components/product/hooks";
import { ProductVariantFieldErrors } from "@/components/product/productValidator";
import ProductVariantSizes from "@/components/product/ProductVariantSizes";
import { Button } from "@/components/ui/button";
import { FormArrayInput, FormInput } from "@/components/ui/form-input";

export default function CategoryCharacteristics({
  category,
  variant,
  variantIndex,
  fieldErrors,
}: {
  category?: Partial<Category>;
  fieldErrors?: ProductVariantFieldErrors;
  variant?: Partial<ProductVariant>;
  variantIndex: number;
}) {
  const { filteredCharacteristics, hasSize } = useCategoryCharacteristics({
    category,
  });
  const [showAll, setShowAll] = useState(false);
  const t = useTranslations("ProductForm.Fields");

  if (!filteredCharacteristics) {
    return null;
  }

  return (
    <div className={"grid gap-4"}>
      {filteredCharacteristics.map((characteristic) => (
        <CharacteristicInput
          key={characteristic.id}
          characteristic={characteristic}
          variantIndex={variantIndex}
          fieldError={
            fieldErrors?.characteristics?.find(({ path }) =>
              path.includes(characteristic.id),
            )?.code
          }
          defaultValue={
            variant?.productCharacteristics?.find(
              (charc) => charc.characteristic.id === characteristic.id,
            )?.value
          }
          hidden={!showAll}
        />
      ))}
      {showAll ? (
        <Button
          variant={"primary-outline"}
          className={"flex items-center justify-center gap-2"}
          onClick={() => setShowAll(false)}
          type={"button"}
        >
          {t("showLess")}
          <ChevronUp className={"h-4 w-4"} />
        </Button>
      ) : (
        <Button
          variant={"primary-outline"}
          className={"flex items-center justify-center gap-2"}
          onClick={() => setShowAll(true)}
          type={"button"}
        >
          {t("showAll")}
          <ChevronDown className={"h-4 w-4"} />
        </Button>
      )}
      <ProductVariantSizes
        sizesFieldErrors={fieldErrors?.sizes}
        variant={variant}
        variantIndex={variantIndex}
        hasSizes={hasSize}
      />
    </div>
  );
}

function CharacteristicInput({
  characteristic,
  variantIndex,
  fieldError,
  defaultValue,
  hidden,
}: {
  characteristic: Characteristic;
  fieldError?: string;
  variantIndex: number;
  defaultValue: string[] | undefined;
  hidden?: boolean;
}) {
  // const t = useTranslations("");
  const { nameEn, nameRu, id, maxCount, type } = characteristic;
  const formInputProps = {
    labelEn: nameEn,
    labelRu: nameRu,
    name: nameEn,
    variantIndex,
    hidden,
    error: fieldError,
  };

  if (type === "ARRAY_NUMBER") {
    return (
      <FormArrayInput
        {...formInputProps}
        type={"number"}
        maxCount={maxCount}
        defaultValue={defaultValue}
      />
    );
  }

  if (type === "ARRAY_STRING") {
    return (
      <FormArrayInput
        {...formInputProps}
        type={"text"}
        maxCount={maxCount}
        defaultValue={defaultValue}
      />
    );
  }

  if (type === "STRING") {
    return (
      <FormInput
        {...formInputProps}
        type={"text"}
        defaultValue={defaultValue && defaultValue[0]}
      />
    );
  }

  return (
    <FormInput
      {...formInputProps}
      type={"number"}
      defaultValue={defaultValue && parseInt(defaultValue[0])}
    />
  );
}
