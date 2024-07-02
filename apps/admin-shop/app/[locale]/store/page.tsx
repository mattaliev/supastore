import { storeList } from "@ditch/lib";
import { ChevronRight } from "lucide-react";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";

import { authenticated, authOptions } from "@/auth";
import WithAuth, { WithAuthProps } from "@/components/auth/with-auth";
import Link from "@/components/navigation/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import Logo from "@/components/ui/logo";

type StorePageProps = {
  params: {
    locale: string;
  };
};

async function StorePage({
  params: { locale },
  accessToken
}: WithAuthProps<StorePageProps>) {
  const stores = await authenticated(accessToken, storeList, {});
  const session = await getServerSession(authOptions);
  const t = await getTranslations("StoreSelectPage");

  return (
    <div className={"h-[80vh] grid items-center justify-center m-4"}>
      <Card>
        <CardHeader>
          <div className={"mb-4"}>
            <Logo />
          </div>
          <CardTitle className={"flex justify-between items-center gap-8"}>
            {t("welcomeBack", { firstName: session?.user.firstName })}
            <Link href={"/store/create"} inStore={false}>
              <Button size={"sm"}>{t("createNewStore")}</Button>
            </Link>
          </CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {stores?.map((store) => (
            <Link href={`/store/${store.id}`} key={store.id} inStore={false}>
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

export default WithAuth<StorePageProps>(StorePage);
