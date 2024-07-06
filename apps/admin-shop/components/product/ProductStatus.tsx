"use client";
import { EntityState } from "@ditch/lib";
import { useTranslations } from "next-intl";

import { ProductVariantFieldErrors } from "@/components/product/productValidator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function ProductStatus({
  productState,
  stateFieldError,
  variantIndex
}: {
  variantIndex: number;
  productState?: EntityState;
  stateFieldError?: ProductVariantFieldErrors["state"];
}) {
  const t = useTranslations("ProductForm.Fields.Status");

  return (
    <div className="grid gap-6">
      <div className="grid gap-3">
        <Label htmlFor="status">{t("label")}</Label>
        {stateFieldError && (
          <p className="text-destructive text-start text-xs">
            {t("statusError")}
          </p>
        )}
        <Select
          defaultValue={productState ? productState : "ACTIVE"}
          name={variantIndex + "state"}
        >
          <SelectTrigger id="status" aria-label={t("placeholder")}>
            <SelectValue placeholder={t("placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">{t("active")}</SelectItem>
            <SelectItem value="INACTIVE">{t("draft")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
