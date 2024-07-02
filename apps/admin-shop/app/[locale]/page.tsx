import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";

import { authOptions } from "@/auth";
import MarketingNav from "@/components/layout/MarketingNav";
import Link from "@/components/navigation/link";
import { Button } from "@/components/ui/button";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations("LandingPage");

  return (
    <div className={"min-h-screen"}>
      <div className={"sticky top-0 z-10 bg-background"}>
        <MarketingNav />
      </div>
      <div
        className={
          "flex flex-col justify-center items-center min-h-96 gap-5 m-4"
        }
      >
        <div className={"grid gap-1"}>
          <p className={"text-2xl text-center"}>{t("title")}</p>
          <p className={"text-lg text-center text-muted-foreground"}>
            {t("description")}
          </p>
        </div>
        <div className="flex items-center justify-center">
          {session ? (
            <Link href={"/store"} inStore={false}>
              <Button>{t("goToDashboard")}</Button>
            </Link>
          ) : (
            <Link href={"/auth/signIn"} inStore={false} localized={false}>
              <Button>{t("signIn")}</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
