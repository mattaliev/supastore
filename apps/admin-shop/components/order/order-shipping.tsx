import { FulfilmentStatus, Shipping } from "@ditch/lib";

import AddTrackingDrawerDialog from "@/components/order/add-tracking-drawer-dialog";
import { FulfilmentStatusBadge } from "@/components/order/order-badges";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default function OrderShipping({
  shipping,
  fulfilmentStatus
}: {
  shipping: Shipping;
  fulfilmentStatus: FulfilmentStatus;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-start gap-2">
            Shipping
            {fulfilmentStatus === FulfilmentStatus.TRACKING && (
              <FulfilmentStatusBadge fulfilmentStatus={fulfilmentStatus} />
            )}
          </div>
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        <dl className="grid gap-3">
          <div className="font-semibold">Contact Information</div>
          <div className="grid gap-0.5 text-muted-foreground">
            {shipping.details ? (
              <>
                <dd>
                  {shipping.details?.firstName +
                    " " +
                    shipping.details?.lastName}
                </dd>
                <dd>{shipping.details?.phone}</dd>
                <dd>{shipping.details?.email}</dd>
              </>
            ) : (
              <dd className={"my-4"}>No contact information provided</dd>
            )}
          </div>
          <div className="font-semibold">Shipping Address</div>
          {shipping.details ? (
            <address className="grid gap-0.5 not-italic text-muted-foreground">
              <dd>{shipping.details?.address}</dd>
              <dd>{shipping.details?.city || ""}</dd>
              <dd>{shipping.details?.province || ""}</dd>
              <dd>{shipping.details?.postcode || ""}</dd>
              <dd>{shipping.details?.country || ""}</dd>
            </address>
          ) : (
            <dd className={"my-4 text-muted-foreground"}>
              No shipping information provided
            </dd>
          )}
          {fulfilmentStatus === FulfilmentStatus.TRACKING && (
            <>
              <div className="font-semibold">Tracking Information</div>
              <div className="grid gap-0.5 text-muted-foreground">
                <div className="flex items-center justify-start space-x-1">
                  <dt className="text-muted-foreground">Carrier:</dt>
                  <dd>{shipping.carrier}</dd>
                </div>
                <div className="flex items-center justify-start space-x-1">
                  <dt className="text-muted-foreground">Tracking Number:</dt>
                  <dd>{shipping.trackingNumber}</dd>
                </div>
              </div>
            </>
          )}
        </dl>
      </CardContent>
      {/*{fulfilmentStatus === FulfilmentStatus.TRACKING && (*/}
      {/*  <CardFooter>*/}
      {/*    <div className="flex space-x-2 ml-auto">*/}
      {/*      <Button size="sm" className="w-full">*/}
      {/*        Track shipment*/}
      {/*      </Button>*/}
      {/*    </div>*/}
      {/*  </CardFooter>*/}
      {/*)}*/}
      {fulfilmentStatus === FulfilmentStatus.FULFILLED && (
        <CardFooter>
          <div className={"flex space-x-2 ml-auto"}>
            <AddTrackingDrawerDialog shippingId={shipping.id} />
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
