import { EntityState } from "@ditch/lib";

import { ProductFieldErrors } from "@/components/product/schemes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function ProductStatus({
  productState,
  stateFieldError
}: {
  productState?: EntityState;
  stateFieldError?: ProductFieldErrors["state"];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="status">Status</Label>
            {stateFieldError && (
              <p className="text-destructive text-start text-xs">
                {stateFieldError[0]}
              </p>
            )}
            <Select
              defaultValue={productState ? productState : "ACTIVE"}
              name="state"
            >
              <SelectTrigger id="status" aria-label="Select status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
