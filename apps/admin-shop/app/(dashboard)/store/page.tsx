import { storeList } from "@ditch/lib";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authenticated, authOptions } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default async function StorePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    redirect("/auth/signIn");
  }

  const stores = await authenticated(session.user.accessToken, storeList, {});

  return (
    <div className={"h-[80vh] grid items-center justify-center m-4"}>
      <Card>
        <CardHeader>
          <CardTitle className={"flex justify-between items-center gap-8"}>
            Welcome Back, {session.user.firstName}
            <Link href={"/store/create"}>
              <Button size={"sm"}>Create Store</Button>
            </Link>
          </CardTitle>
          <CardDescription>
            Select the store you want to work with today
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stores?.map((store) => (
            <Link href={`/store/${store.id}`} key={store.id}>
              <div
                className={
                  "flex items-center justify-start gap-3 p-2 hover:bg-muted rounded-xl group"
                }
              >
                <div className={"h-10 w-10 bg-muted rounded-xl"}></div>
                <div className={"flex items-center justify-between w-full"}>
                  <div>
                    <h1>{store.storeName}</h1>
                    <p className={"text-muted-foreground text-xs"}>
                      Last updated 2 days ago
                    </p>
                  </div>
                  <ChevronRight
                    size={24}
                    className={"hidden group-hover:block text-primary"}
                  />
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
