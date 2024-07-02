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
  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Close the keyboard
      e.currentTarget.blur();
    }
  };

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
        className={
          "bg-telegram-bg-color border-telegram-hint-color focus:ring-telegram-button-color"
        }
        onKeyDown={onKeyPress}
      />
      {error && (
        <p className="text-telegram-accent-text-color text-xs">{error}</p>
      )}
    </div>
  );
}
