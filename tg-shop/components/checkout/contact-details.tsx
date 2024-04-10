import { ShippingDetailsFieldErrors } from "@/components/checkout/schemes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormInput from "@/components/ui/form-input";
import { ShippingDetails } from "@/lib/api/types";

export default function ContactDetails({
  shippingDetails,
  formErrors,
}: {
  shippingDetails?: ShippingDetails;
  formErrors?: ShippingDetailsFieldErrors;
}) {
  return (
    <Card className="mx-auto bg-telegram-bg-color">
      <CardHeader className="flex flex-col items-center space-y-2">
        <CardTitle>Contact information</CardTitle>
        <CardDescription>Enter your contact information below</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="First name"
            id="first-name"
            placeholder="Enter your first name"
            error={formErrors?.firstName && formErrors.firstName[0]}
            defaultValue={shippingDetails?.firstName}
          />
          <FormInput
            label="Last name"
            id="last-name"
            placeholder="Enter your last name"
            error={formErrors?.lastName && formErrors.lastName[0]}
            defaultValue={shippingDetails?.lastName || ""}
          />
        </div>
        <FormInput
          label="Email (Optional)"
          id="email"
          placeholder="Enter your email"
          type="email"
          error={formErrors?.email && formErrors.email[0]}
          defaultValue={shippingDetails?.email || ""}
        />
        <FormInput
          label="Phone (Optional)"
          id="phone"
          placeholder="Enter your phone number"
          type="tel"
          error={formErrors?.phone && formErrors.phone[0]}
          defaultValue={shippingDetails?.phone || ""}
        />
      </CardContent>
    </Card>
  );
}
