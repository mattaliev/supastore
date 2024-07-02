"use client";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";

import AddressCreateDrawer from "@/components/checkout/ShippingAddressCreateDrawer";
import { Input } from "@/components/ui/input";

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  selectedPlace: google.maps.places.PlaceResult | null;
}

export function PlaceAutocomplete({
  onPlaceSelect,
  selectedPlace
}: PlaceAutocompleteProps) {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");
  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address", "address_components"]
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="p-2 gap-1 autocomplete-container flex items-center justify-start">
      <Input
        ref={inputRef}
        className={
          "bg-telegram-bg-color border-none ring-none justify-self-stretch text-telegram-text-color text-sm w-64"
        }
      />
      <AddressCreateDrawer selectedPlace={selectedPlace} />
    </div>
  );
}
