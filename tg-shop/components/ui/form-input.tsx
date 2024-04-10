import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type FormInputProps = {
  label: string;
  error?: string;
  id: string;
  placeholder: string;
  type?: string;
  defaultValue?: string;
};

export default function FormInput({
  label,
  error,
  id,
  placeholder,
  type,
  defaultValue,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        name={id}
        id={id}
        placeholder={placeholder}
        type={type}
        value={defaultValue}
        defaultValue={defaultValue}
      />
      {error && (
        <p className="text-telegram-accent-text-color text-xs">{error}</p>
      )}
    </div>
  );
}
