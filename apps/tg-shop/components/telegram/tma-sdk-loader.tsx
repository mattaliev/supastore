"use client";

import { storeBotUsernameGet } from "@ditch/lib";
import { DisplayGate, SDKProvider } from "@tma.js/sdk-react";
import { ReactNode, useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Link from "@/components/navigation/link";
import { useStore } from "@/components/store/store-context";
import { Button } from "@/components/ui/button";

interface SDKProviderErrorProps {
  error: unknown;
}

const SDKProviderError = ({ error }: SDKProviderErrorProps) => {
  const storeId = useStore();
  const [storeBotUsername, setStoreBotUsername] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStoreBotUsername() {
      const botUsername = await storeBotUsernameGet({ storeId });
      setStoreBotUsername(botUsername);
    }

    fetchStoreBotUsername();
  }, [storeId]);

  return (
    <div>
      <h1>Opps, something went wrong...</h1>
      <p>This Online Store is only made to be used inside Telegram</p>

      {storeBotUsername ? (
        <Link
          href={`https://t.me/${storeBotUsername}`}
          inStore={false}
          localized={false}
        >
          <Button>Open in Telegram</Button>
        </Link>
      ) : (
        <Button disabled>
          <AiOutlineLoading3Quarters className="animate-spin" />
          Loading...
        </Button>
      )}
    </div>
  );
};

const SDKProviderLoading = () => {
  return (
    <div className={"min-h-[80vh] m-auto bg-telegram-bg-color"}>
      <AiOutlineLoading3Quarters
        className={
          "animate-spin w-16 h-16 mx-auto text-telegram-button-color mt-64"
        }
      />
    </div>
  );
};

const SDKInitialState = () => {
  return (
    <div className={"min-h-[80vh] m-auto bg-telegram-bg-color"}>
      <AiOutlineLoading3Quarters
        className={
          "animate-spin w-16 h-16 mx-auto text-telegram-button-color mt-64"
        }
      />
    </div>
  );
};

export default function TmaSdkLoader({ children }: { children: ReactNode }) {
  return (
    <SDKProvider
      async={true}
      options={{ cssVars: true, acceptCustomStyles: true }}
    >
      <DisplayGate
        loading={<SDKProviderLoading />}
        error={SDKProviderError}
        initial={SDKInitialState}
      >
        {children}
      </DisplayGate>
    </SDKProvider>
  );
}
