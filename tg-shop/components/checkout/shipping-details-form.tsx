"use client";
import { useFormState } from "react-dom";

import { createShippingDetails } from "@/components/checkout/actions";
import ContinueToPaymentButton from "@/components/checkout/continue-to-payment-button";
import ShippingDetailsInput from "@/components/checkout/shipping-details-input";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import { ShippingDetails } from "@/lib/api/types";

import ContactDetails from "./contact-details";

export default function ShippingDetailsForm({
  shippingDetails,
}: {
  shippingDetails?: ShippingDetails;
}) {
  const [formStatus, formAction] = useFormState(createShippingDetails, null);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={shippingDetails?.id} />
      <ContactDetails
        shippingDetails={shippingDetails}
        formErrors={formStatus?.fieldErrors}
      />
      <ShippingDetailsInput
        shippingDetails={shippingDetails}
        formErrors={formStatus?.fieldErrors}
      />
      <div className="mx-6 mb-6 max-w-sm space-y-2">
        <ContinueToPaymentButton />
        {formStatus?.formError && (
          <p className={"text-telegram-text-color text-center mt-2 text-xs"}>
            {formStatus.formError}
          </p>
        )}
      </div>
    </form>
  );
}
