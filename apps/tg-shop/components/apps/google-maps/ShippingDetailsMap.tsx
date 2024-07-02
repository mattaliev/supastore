"use client";
import {
  AdvancedMarker,
  APIProvider,
  ControlPosition,
  Map,
  MapControl,
  useAdvancedMarkerRef
} from "@vis.gl/react-google-maps";
import { useLocale } from "next-intl";
import { useState } from "react";

import { PlaceAutocomplete } from "@/components/apps/google-maps/PlacesAutocomplete";
import MapHandler from "@/components/checkout/MapHandler";

export default function ShippingAddressMap() {
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [markerRef, marker] = useAdvancedMarkerRef();

  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    setSelectedPlace(place);
  };

  const locale = useLocale();

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY as string}
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
      language={locale}
    >
      <Map
        mapId={"bf51a910020fa25a"}
        defaultZoom={10}
        defaultCenter={{ lat: 55.691, lng: 37.677 }}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        <AdvancedMarker ref={markerRef} position={null} />
      </Map>
      <MapControl position={ControlPosition.TOP_LEFT}>
        <div className="autocomplete-control">
          <PlaceAutocomplete
            onPlaceSelect={handlePlaceSelect}
            selectedPlace={selectedPlace}
          />
        </div>
      </MapControl>
      <MapHandler place={selectedPlace} marker={marker} />
    </APIProvider>
  );
}
