import { FulfilmentStatus, Shipping } from "@ditch/lib";
import { useTranslations } from "next-intl";

import AddTrackingDrawerDialog from "@/components/order/add-tracking-drawer-dialog";
import { FulfilmentStatusBadge } from "@/components/order/order-badges";
import {
  Card,
  CardContent,
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
  const t = useTranslations("OrderEditPage.OrderShipping");

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-start gap-2">
            {t("title")}
            {fulfilmentStatus === FulfilmentStatus.TRACKING && (
              <FulfilmentStatusBadge fulfilmentStatus={fulfilmentStatus} />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <dl className="grid gap-3">
          <div className="font-semibold">{t("contactInformation")}</div>
          <div className="grid gap-0.5 text-muted-foreground">
            {shipping.contactInfo ? (
              <>
                <dd>{shipping.contactInfo?.name}</dd>
                <dd>{shipping.contactInfo?.phone}</dd>
                <dd>{shipping.contactInfo?.email}</dd>
              </>
            ) : (
              <dd className={"my-4"}>{t("noContactInformation")}</dd>
            )}
          </div>
          <div className="font-semibold">{t("shippingAddress")}</div>
          {shipping.shippingAddress ? (
            <address className="grid gap-0.5 not-italic text-muted-foreground">
              <dd>{shipping.shippingAddress?.address}</dd>
              <dd>{shipping.shippingAddress?.additionalInfo || ""}</dd>
            </address>
          ) : (
            <dd className={"my-4 text-muted-foreground"}>
              {t("noShippingAddress")}
            </dd>
          )}
          {fulfilmentStatus === FulfilmentStatus.TRACKING && (
            <>
              <div className="font-semibold">{t("trackingInformation")}</div>
              <div className="grid gap-0.5 text-muted-foreground">
                <div className="flex items-center justify-start space-x-1">
                  <dt className="text-muted-foreground">{t("carrier")}:</dt>
                  <dd>{shipping.carrier}</dd>
                </div>
                <div className="flex items-center justify-start space-x-1">
                  <dt className="text-muted-foreground">
                    {t("trackingNumber")}:
                  </dt>
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
