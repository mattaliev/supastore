import { EntityState } from "@ditch/lib";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";

export function ProductBadge({ state }: { state: string }) {
  const t = useTranslations("ProductBadge");
  if (state === EntityState.ACTIVE) {
    return <Badge variant="default">{t("active")}</Badge>;
  }

  return <Badge variant="outline">{t("draft")}</Badge>;
}
