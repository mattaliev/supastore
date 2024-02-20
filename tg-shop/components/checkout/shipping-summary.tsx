import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PencilIcon } from "@/components/ui/icons";
import { ShippingDetails } from "@/lib/api/types";

export const ShippingSummary = ({
  shippingDetails,
}: {
  shippingDetails: ShippingDetails;
}) => {
  return (
    <>
      <Card className="pt-16">
        <CardHeader>
          <CardTitle>Contact information</CardTitle>
        </CardHeader>
        <CardContent className="text-sm flex items-center">
          <div className="grid gap-1">
            <div className="text-telegram-hint-color">{`${shippingDetails.firstName} ${shippingDetails.lastName}`}</div>
            <div className="text-telegram-hint-color">
              {shippingDetails.phone}
            </div>
            {shippingDetails.email && (
              <div className="text-telegram-hint-color">
                {shippingDetails.email}
              </div>
            )}
            {shippingDetails.phone && (
              <div className="text-telegram-hint-color">
                {shippingDetails.phone}
              </div>
            )}
          </div>
          <Link href={`/checkout/shipping?update=true`}>
            <PencilIcon className="w-4 h-4 ml-2 text-telegram-hint-color hover:text-telegram-button-color" />
          </Link>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Shipping address</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-telegram-hint-color flex items-center">
          <div className="text-telegram-hint-color">
            {`${shippingDetails.address}`}
            <br />
            {`${shippingDetails.city}, ${shippingDetails.postcode}`}
            <br />
            {`${shippingDetails.country}`}
          </div>
          <Link href={`/checkout/shipping?update=true`}>
            <PencilIcon className="w-4 h-4 ml-2 text-telegram-hint-color hover:text-telegram-button-color" />
          </Link>
        </CardContent>
      </Card>
    </>
  );
};
