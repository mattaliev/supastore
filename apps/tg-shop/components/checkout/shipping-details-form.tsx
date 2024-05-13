"use client";
import { ShippingDetails } from "@ditch/lib";
import { useHapticFeedback } from "@tma.js/sdk-react";
import { useEffect } from "react";
import { useFormState } from "react-dom";

import { createOrUpdateShippingDetails } from "@/components/checkout/actions";
import ContinueToPaymentButton from "@/components/checkout/continue-to-payment-button";
import ShippingDetailsInput from "@/components/checkout/shipping-details-input";

import ContactDetails from "./contact-details";

export default function ShippingDetailsForm({
  shippingDetails,
  shippingId
}: {
  shippingDetails?: ShippingDetails;
  shippingId: string;
}) {
  const [formStatus, formAction] = useFormState(
    createOrUpdateShippingDetails,
    null
  );
  const hapticFeedback = useHapticFeedback();

  useEffect(() => {
    if (formStatus?.formError || formStatus?.fieldErrors) {
      hapticFeedback.notificationOccurred("error");
    }
  }, [formStatus?.formError, formStatus?.fieldErrors]);

  return (
    <form action={formAction}>
      <input type="hidden" name="shipping-id" value={shippingId} />
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
