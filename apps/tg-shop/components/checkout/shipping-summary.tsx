import { ShippingDetails } from "@ditch/lib";

import UpdateShippingDetailsButton from "@/components/checkout/update-shipping-details-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ShippingSummary = ({
  shippingDetails,
  mutable = true
}: {
  shippingDetails?: ShippingDetails;
  mutable?: boolean;
}) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Contact information</CardTitle>
        </CardHeader>
        <CardContent className="text-sm flex items-center">
          <dt className="grid gap-1 text-telegram-hint-color not-italic">
            <dd>
              {`${shippingDetails?.firstName} ${shippingDetails?.lastName}`}
            </dd>
            {/*<div className="text-telegram-hint-color">*/}
            {/*  {shippingDetails?.phone || ""}*/}
            {/*</div>*/}
            {shippingDetails?.email && <dd>{shippingDetails.email || ""}</dd>}
            {shippingDetails?.phone && <dd>{shippingDetails.phone || ""}</dd>}
          </dt>
          {mutable && <UpdateShippingDetailsButton />}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Shipping address</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-telegram-hint-color flex items-center">
          <address className="text-telegram-hint-color not-italic">
            <dd>{shippingDetails?.address || ""}</dd>
            <dd>{shippingDetails?.city || ""}</dd>
            <dd>{shippingDetails?.province || ""}</dd>
            <dd>{shippingDetails?.postcode}</dd>
            <dd>{shippingDetails?.country}</dd>
          </address>
          {mutable && <UpdateShippingDetailsButton />}
        </CardContent>
      </Card>
    </>
  );
};
