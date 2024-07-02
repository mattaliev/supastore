"use client";
import * as React from "react";
import { useState } from "react";

import { Textarea, TextareaProps } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { Input, InputProps } from "./input";
import { InputTags, InputTagsProps } from "./input-tags";
import { Label } from "./label";

type FormInputProps = InputProps & {
  labelEn?: string;
  labelRu?: string;
  variantIndex?: number;
  locale?: string;
  error?: string;
  choices?: string[];
};

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    { error, labelEn, labelRu, name, choices, variantIndex, hidden, ...props },
    ref
  ) => {
    const inputName =
      typeof variantIndex === "number" && name ? variantIndex + name : name;
    return (
      <div className={cn("grid gap-2", { hidden })}>
        <Label htmlFor={inputName}>
          {props.locale === "ru" ? labelRu : labelEn}
        </Label>
        {error && <p className={"text-sm text-destructive"}>{error}</p>}
        <Input ref={ref} name={inputName} {...props} />
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export type FormArrayInputProps = Omit<
  InputTagsProps,
  "value" | "onChange" | "defaultValue"
> & {
  labelEn?: string;
  labelRu?: string;
  defaultValue?: string[];
  variantIndex?: number;
  locale?: string;
  error?: string;
  maxCount?: number;
};

const FormArrayInput = React.forwardRef<HTMLInputElement, FormArrayInputProps>(
  (
    {
      error,
      name,
      labelEn,
      labelRu,
      defaultValue,
      variantIndex,
      maxCount,
      hidden,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = React.useState<string[]>(defaultValue || []);
    const inputName =
      typeof variantIndex === "number" && name ? variantIndex + name : name;

    const hasMaxCount = maxCount && maxCount !== 0;

    return (
      <div className={cn("grid gap-2", { hidden })}>
        <Label htmlFor={inputName}>
          {props.locale === "ru" ? labelRu : labelEn}
        </Label>
        {error && <p className={"text-sm text-destructive"}>{error}</p>}
        <InputTags
          ref={ref}
          {...props}
          value={value}
          onChange={setValue}
          maxCount={hasMaxCount ? maxCount : undefined}
        />
        {value &&
          value.length > 0 &&
          value.map((item, index) => (
            <input type={"hidden"} name={inputName} value={item} key={index} />
          ))}
      </div>
    );
  }
);

FormArrayInput.displayName = "FormArrayInput";

export type FormTextAreaProps = TextareaProps & {
  variantIndex?: number;
  locale?: string;
  error?: string;
  labelEn?: string;
  labelRu?: string;
  choices?: string[];
  maxCount?: number;
};

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  (
    {
      error,
      name,
      labelEn,
      labelRu,
      variantIndex,
      maxCount,
      value,
      onChange,
      hidden,
      ...props
    },
    ref
  ) => {
    const inputName =
      typeof variantIndex === "number" && name ? variantIndex + name : name;
    const [symbolsLength, setSymbolsLength] = useState(
      typeof value === "string" ? value.length : 0
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setSymbolsLength(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className={cn("grid gap-2", { hidden })}>
        <Label htmlFor={inputName}>
          {props.locale === "ru" ? labelRu : labelEn}
        </Label>
        {error && <p className={"text-sm text-destructive"}>{error}</p>}
        <Textarea
          ref={ref}
          name={inputName}
          onChange={handleChange}
          {...props}
        />
        {maxCount && (
          <p
            className={cn("ml-auto text-xs text-muted-foreground", {
              "text-destructive": symbolsLength > maxCount
            })}
          >
            {symbolsLength}/{maxCount}
          </p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";

export { FormInput, FormArrayInput, FormTextarea };
