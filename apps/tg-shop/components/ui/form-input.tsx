"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type FormInputProps = {
  label: string;
  error?: string;
  id: string;
  placeholder: string;
  type?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function FormInput({
  label,
  error,
  id,
  placeholder,
  type,
  value,
  defaultValue,
  onChange
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        onChange={onChange}
        name={id}
        id={id}
        placeholder={placeholder}
        type={type}
        value={value}
        defaultValue={defaultValue}
      />
      {error && (
        <p className="text-telegram-accent-text-color text-xs">{error}</p>
      )}
    </div>
  );
}
