import UpdateShippingDetailsButton from "@/components/checkout/update-shipping-details-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShippingDetails } from "@/lib/api/types";

export const ShippingSummary = ({
  shippingDetails,
}: {
  shippingDetails?: ShippingDetails;
}) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Contact information</CardTitle>
        </CardHeader>
        <CardContent className="text-sm flex items-center">
          <div className="grid gap-1">
            <div className="text-telegram-hint-color">
              {`${shippingDetails?.firstName} ${shippingDetails?.lastName}`}
            </div>
            <div className="text-telegram-hint-color">
              {shippingDetails?.phone}
            </div>
            {shippingDetails?.email && (
              <div className="text-telegram-hint-color">
                {shippingDetails.email}
              </div>
            )}
            {shippingDetails?.phone && (
              <div className="text-telegram-hint-color">
                {shippingDetails.phone}
              </div>
            )}
          </div>
          <UpdateShippingDetailsButton />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Shipping address</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-telegram-hint-color flex items-center">
          <div className="text-telegram-hint-color">
            {`${shippingDetails?.address}`}
            <br />
            {`${shippingDetails?.city}`}
            <br />
            {`${shippingDetails?.province}`}
            <br />
            {`${shippingDetails?.postcode}`}
            <br />
            {`${shippingDetails?.country}`}
          </div>
          <UpdateShippingDetailsButton />
        </CardContent>
      </Card>
    </>
  );
};
