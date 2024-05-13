import { TelegramUser } from "@ditch/lib";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default function OrderCustomer({ user }: { user?: TelegramUser }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Name</dt>
            <dd>
              {!user && "Anonymous User"}
              {user?.firstName} {user?.lastName || ""}
            </dd>
          </div>
          {user?.username && (
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Username</dt>
              <dd>@{user?.username}</dd>
            </div>
          )}
        </dl>
      </CardContent>
      <CardFooter>
        <div className="flex ml-auto">
          <Link href={`/customers/edit/${user?.id}`}>
            <Button variant="outline" size="sm" className="w-full">
              View Customer
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
