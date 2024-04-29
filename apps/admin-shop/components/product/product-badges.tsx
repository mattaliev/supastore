import { EntityState } from "@ditch/lib";

import { Badge } from "@/components/ui/badge";

export function ProductBadge({ state }: { state: string }) {
  if (state === EntityState.ACTIVE) {
    return <Badge variant="success">Active</Badge>;
  }

  return <Badge variant="outline">Draft</Badge>;
}
