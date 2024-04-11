import { usePlacesWidget } from "react-google-autocomplete";

import { FormInputProps } from "@/components/ui/form-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AddressAutocompleteProps = FormInputProps & {
  onPlaceSelected: (places: AddressAutocompleteSelectedResult) => void;
};

export type AddressAutocompleteSelectedResult = {
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
  formatted_address: string;
};

export function AddressAutocomplete({
  id,
  label,
  placeholder,
  type,
  defaultValue,
  error,
  onPlaceSelected,
}: AddressAutocompleteProps) {
  console.log("apiKey", process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY);
  console.log(
    "backend service url",
    process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL,
  );
  console.log("Env: ", process.env);

  const { ref } = usePlacesWidget({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
    onPlaceSelected: (places) => onPlaceSelected(places),
    options: {
      types: ["address"],
      fields: ["address_components", "formatted_address"],
      defaultValue: "Bali",
    },
  });

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        ref={ref as unknown as React.RefObject<HTMLInputElement>}
        name={id}
        id={id}
        placeholder={placeholder}
        type={type}
        defaultValue={defaultValue}
      />
      {error && (
        <p className="text-telegram-accent-text-color text-xs">{error}</p>
      )}
    </div>
  );
}
