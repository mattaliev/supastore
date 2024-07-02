import { TelegramUser } from "@ditch/lib";
import { useTranslations } from "next-intl";

import Link from "@/components/navigation/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default function OrderCustomer({ user }: { user?: TelegramUser }) {
  const t = useTranslations("OrderEditPage");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("customer")}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">{t("name")}</dt>
            <dd>
              {!user && "Anonymous User"}
              {user?.firstName} {user?.lastName || ""}
            </dd>
          </div>
          {user?.username && (
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">{t("username")}</dt>
              <dd>@{user?.username}</dd>
            </div>
          )}
        </dl>
      </CardContent>
      <CardFooter>
        <div className="flex ml-auto">
          <Link href={`/customers/edit/${user?.id}`}>
            <Button variant="outline" size="sm" className="w-full">
              {t("viewCustomer")}
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
