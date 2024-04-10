"use client";
import { useState } from "react";

import {
  AddressAutocomplete,
  AddressAutocompleteSelectedResult,
} from "@/components/checkout/address-autocomplete";
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

type ShippingAddress = Omit<
  ShippingDetails,
  "firstName" | "lastName" | "email" | "phone"
>;

export default function ShippingDetailsInput({
  shippingDetails,
  formErrors,
}: {
  shippingDetails?: ShippingDetails;
  formErrors?: ShippingDetailsFieldErrors;
}) {
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    id: shippingDetails?.id || "",
    address: shippingDetails?.address || "",
    city: shippingDetails?.city || "",
    province: shippingDetails?.province || "",
    postcode: shippingDetails?.postcode || "",
    country: shippingDetails?.country || "",
  });

  const handlePlaceSelected = (places: AddressAutocompleteSelectedResult) => {
    const address: ShippingAddress = {
      id: shippingAddress.id,
      address: "",
      city: "",
      province: "",
      postcode: "",
      country: "",
    };

    console.log(places);

    places.address_components.forEach((component) => {
      const type = component.types[0];
      switch (type) {
        case "locality":
          address.city = component.long_name;
          break;
        case "administrative_area_level_1":
          address.province = component.long_name;
          break;
        case "postal_code":
          address.postcode = component.long_name;
          break;
        case "country":
          address.country = component.long_name;
          break;
        case "postal_town":
          address.city = component.long_name;
          break;
      }
    });

    address.address = places.formatted_address;

    setShippingAddress((prevState) => address);
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="flex flex-col items-center space-y-2">
        <CardTitle>Shipping address</CardTitle>
        <CardDescription>Enter your shipping address below</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <AddressAutocomplete
          label={"Address"}
          id={"address"}
          placeholder={"Enter your address"}
          onPlaceSelected={handlePlaceSelected}
          error={formErrors?.address && formErrors?.address[0]}
          defaultValue={shippingAddress.address || ""}
        />
        {/*<FormInput*/}
        {/*  label="Address"*/}
        {/*  id="address"*/}
        {/*  placeholder="Enter your address"*/}
        {/*  error={formErrors?.address && formErrors?.address[0]}*/}
        {/*  defaultValue={shippingDetails?.address || ""}*/}
        {/*/>*/}
        <FormInput
          label="City"
          id="city"
          placeholder="Enter your city"
          error={formErrors?.city && formErrors?.city[0]}
          defaultValue={shippingAddress.city || ""}
        />
        <FormInput
          label={"Province/State"}
          id={"province"}
          placeholder={"Enter your state/province"}
          error={formErrors?.province && formErrors?.province[0]}
          defaultValue={shippingAddress.province || ""}
        />
        <FormInput
          label="Postal code"
          id="postcode"
          placeholder="Enter your postal code"
          error={formErrors?.postcode && formErrors?.postcode[0]}
          defaultValue={shippingAddress.postcode || ""}
        />
        <FormInput
          label="Country"
          id="country"
          placeholder="Enter your country"
          error={formErrors?.country && formErrors?.country[0]}
          defaultValue={shippingAddress.country || ""}
        />
        <FormCheckbox
          label="Save for faster checkout next time"
          id={"is-default"}
        />
      </CardContent>
    </Card>
  );
}
