import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export type FormCheckboxProps = {
  label: string;
  error?: string;
  id: string;
};

export default function FormCheckbox({ id, label, error }: FormCheckboxProps) {
  return (
    <>
      <div className="flex items-center space-x-4">
        <Checkbox
          id={id}
          name={id}
          className="bg-telegram-bg-color border border-telegram-text-color"
        />
        <Label htmlFor={id} className="text-telegram-hint-color font-light">
          {label}
        </Label>
      </div>
      {error && (
        <p className="text-telegram-accent-text-color text-xs">{error}</p>
      )}
    </>
  );
}
