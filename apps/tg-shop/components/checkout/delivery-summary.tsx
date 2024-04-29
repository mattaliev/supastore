import { ShippingDetails } from "@ditch/lib";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function DeliverySummary({
  shippingDetails,
}: {
  shippingDetails?: ShippingDetails;
}): JSX.Element {
  if (
    shippingDetails?.country === "Indonesia" &&
    shippingDetails?.province === "Bali"
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Delivery</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <RadioGroup defaultValue="local-delivery">
            <div className="flex items-center justify-start gap-x-4">
              <RadioGroupItem
                className="text-telegram-text-color bg-telegram-bg-color border-telegram-border-color"
                value="local-delivery"
                id="local-delivery"
              />
              <Label htmlFor="local-delivery">Local delivery - free</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <RadioGroup defaultValue="international-delivery">
          <div className="flex items-center justify-start gap-x-4">
            <RadioGroupItem
              className="text-telegram-text-color bg-telegram-bg-color border-telegram-border-color"
              value="international-delivery"
              id="international-delivery"
            />
            <Label htmlFor="international-delivery">
              International delivery - $19.99
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
