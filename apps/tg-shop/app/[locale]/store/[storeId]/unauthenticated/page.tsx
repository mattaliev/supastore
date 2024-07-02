"use client";

import { useLaunchParams } from "@tma.js/sdk-react";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { useRouter } from "@/components/i18n/i18n-navigation";
import { useStore } from "@/components/store/store-context";

export default function UnauthenticatedPage() {
  const launchParams = useLaunchParams();
  const storeId = useStore();
  const router = useRouter();

  useEffect(() => {
    async function signInUser() {
      if (launchParams.initDataRaw) {
        await signIn("telegram", {
          storeId,
          initDataRaw: launchParams.initDataRaw
        });
        router.push(`/store/${storeId}`);
      }
    }
    signInUser();
  }, []);

  return (
    <div className={"flex flex-col items-center justify-center h-screen"}>
      <AiOutlineLoading3Quarters
        className={"w-16 h-16 mx-auto animate-spin text-telegram-button-color"}
      />
    </div>
  );
}
