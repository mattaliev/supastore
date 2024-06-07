"use client";
import { Store } from "@ditch/lib";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { updateStore } from "@/components/store/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <Button
        className={"flex justify-center items-center gap-2"}
        size={"sm"}
        disabled
      >
        <LoaderCircle className={"animate-spin h-5 w-5"} />
        Saving Changes...
      </Button>
    );
  }

  return (
    <Button size={"sm"} type={"submit"}>
      Save Changes
    </Button>
  );
}

export default function StoreLogo({ store }: { store: Store }) {
  const [formState, formAction] = useFormState(updateStore, null);
  const [logoDarkUrl, setLogoDarkUrl] = useState<string | null>(
    store.logoDark || null
  );

  const [logoLightUrl, setLogoLightUrl] = useState<string | null>(
    store.logoLight || null
  );

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isDark: boolean
  ) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      if (isDark) {
        setLogoDarkUrl(URL.createObjectURL(selectedFile));
      } else {
        setLogoLightUrl(URL.createObjectURL(selectedFile));
      }
    }
  };

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Store Logo</CardTitle>
          <CardDescription>
            Update your store's logo. Recommended size is 96x32 pixels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={"grid gap-4 lg:grid-cols-2"}>
            <div className={"grid gap-2"}>
              <Label htmlFor={"logo-light"}>Light logo</Label>
              <p className={"text-muted-foreground text-xs text-start"}>
                This logo will be used when user has a dark screen
              </p>
              {formState?.fieldErrors?.logoLight && (
                <p className={"text-xs text-destructive text-start"}>
                  {formState?.fieldErrors.logoLight[0]}
                </p>
              )}
              <Input
                type={"file"}
                id={"logo-light"}
                name={"logo-light"}
                onChange={(e) => handleFileChange(e, false)}
              />
              <LogoPreview logoUrl={logoLightUrl} />
            </div>
            <div className={"grid gap-2"}>
              <Label htmlFor={"logo-dark"}>Dark logo</Label>
              <p className={"text-muted-foreground text-xs text-start"}>
                This logo will be used when user has a light screen
              </p>
              {formState?.fieldErrors?.logoDark && (
                <p className={"text-xs text-destructive text-start"}>
                  {formState?.fieldErrors.logoDark[0]}
                </p>
              )}
              <Input
                type={"file"}
                id={"logo-dark"}
                name={"logo-dark"}
                onChange={(e) => handleFileChange(e, true)}
              />
              <LogoPreview logoUrl={logoDarkUrl} isDark />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}

function LogoPreview({
  logoUrl,
  isDark
}: {
  logoUrl?: string | null;
  isDark?: boolean;
}) {
  if (logoUrl) {
    return (
      <div className={"grid gap-2"}>
        <Label>Nav Preview</Label>
        <div
          className={
            "w-full xs:w-[370px] flex justify-between items-center p-4 border" +
            (isDark ? " bg-white" : " bg-slate-800")
          }
        >
          <Image
            src={logoUrl}
            alt={"logo-dark"}
            width={200}
            height={200}
            className={"w-24 h-8 object-contain"}
          />
          <CartIcon
            className={
              "w-6 h-6 hover:text-sky-500 transition duration-300 ease-in-out" +
              (isDark ? " text-black" : " text-white")
            }
          />
        </div>
      </div>
    );
  }
}

function CartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
  );
}
