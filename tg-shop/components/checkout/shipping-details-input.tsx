import { ShippingDetailsFieldErrors } from "@/components/checkout/schemes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormCheckbox from "@/components/ui/form-checkbox";
import FormInput from "@/components/ui/form-input";
import { ShippingDetails } from "@/lib/api/types";

export default function ShippingDetailsInput({
  shippingDetails,
  formErrors,
}: {
  shippingDetails?: ShippingDetails;
  formErrors?: ShippingDetailsFieldErrors;
}) {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="flex flex-col items-center space-y-2">
        <CardTitle>Shipping address</CardTitle>
        <CardDescription>Enter your shipping address below</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <FormInput
          label="Country"
          id="country"
          placeholder="Enter your country"
          error={formErrors?.country && formErrors?.country[0]}
          defaultValue={shippingDetails?.country || ""}
        />
        <FormInput
          label="Address"
          id="address"
          placeholder="Enter your address"
          error={formErrors?.address && formErrors?.address[0]}
          defaultValue={shippingDetails?.address || ""}
        />
        <FormInput
          label="City"
          id="city"
          placeholder="Enter your city"
          error={formErrors?.city && formErrors?.city[0]}
          defaultValue={shippingDetails?.city || ""}
        />
        <FormInput
          label="Postal code"
          id="postcode"
          placeholder="Enter your postal code"
          error={formErrors?.postcode && formErrors?.postcode[0]}
          defaultValue={shippingDetails?.postcode || ""}
        />
        <FormCheckbox
          label="Save for faster checkout next time"
          id={"is-default"}
        />
      </CardContent>
    </Card>
  );
}
