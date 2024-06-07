import { PanelLeft } from "lucide-react";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import AdminDropdownMenu from "@/components/admin/admin-dropdown-menu";
import Link from "@/components/navigation/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className={"min-h-screen"}>
      <div className={"sticky top-0 z-10 bg-background"}>
        <nav className={"flex items-center justify-between p-6"}>
          <div className={"flex gap-2 sm:gap-8 justify-start items-center"}>
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="sm:hidden">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                  <Logo />
                  <Link
                    href={"https://ditchconceptstore.mintlify.app"}
                    inStore={false}
                    localized={false}
                  >
                    Guides
                  </Link>
                  <Link href={"/"} inStore={false} localized={false}>
                    Pricing
                  </Link>
                  <Link
                    href={"https://t.me/matveyaliev"}
                    inStore={false}
                    localized={false}
                  >
                    Contact
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <Logo />
            <Link
              href={"https://ditchconceptstore.mintlify.app"}
              inStore={false}
              className={
                "hidden sm:block text-sm text-muted-foreground hover:text-primary transition ease-in-out duration-300 hover:-translate-y-1"
              }
            >
              Guides
            </Link>
            <Link
              href={"/"}
              inStore={false}
              className={
                "hidden sm:block text-sm text-muted-foreground hover:text-primary transition ease-in-out duration-300 hover:-translate-y-1"
              }
            >
              Pricing
            </Link>
            <Link
              href={"https://t.me/matveyaliev"}
              inStore={false}
              className={
                "hidden sm:block text-sm text-muted-foreground hover:text-primary transition ease-in-out duration-300 hover:-translate-y-1"
              }
            >
              Contact
            </Link>
          </div>
          <div className={"flex gap-4"}>
            {session ? (
              <AdminDropdownMenu />
            ) : (
              <Link href={"/auth/signIn"} inStore={false} localized={false}>
                <Button size={"sm"}>Sign In</Button>
              </Link>
            )}
          </div>
        </nav>
      </div>
      <div
        className={
          "flex flex-col justify-center items-center min-h-96 gap-5 m-4"
        }
      >
        <div className={"grid gap-1"}>
          <p className={"text-2xl text-center"}>
            Create your Telegram store in just a few minutes
          </p>
          <p className={"text-lg text-center text-muted-foreground"}>
            Upload your products, connect to your Telegram bot, setup a payment
            system, and you are ready to go!
          </p>
        </div>
        <div className="flex items-center justify-center">
          {session ? (
            <Link href={"/store"} inStore={false}>
              <Button>Go to Dashboard</Button>
            </Link>
          ) : (
            <Link href={"/auth/signIn"} inStore={false} localized={false}>
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
