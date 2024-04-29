"use client";

import { DisplayGate, SDKProvider } from "@tma.js/sdk-react";
import { ReactNode } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface SDKProviderErrorProps {
  error: unknown;
}

const SDKProviderError = ({ error }: SDKProviderErrorProps) => {
  return (
    <div>
      Oops. Something went wrong.
      <blockquote>
        <code>
          {error instanceof Error ? error.message : JSON.stringify(error)}
        </code>
      </blockquote>
    </div>
  );
};

const SDKProviderLoading = () => {
  return (
    <div className={"min-h-screen m-auto bg-telegram-bg-color"}>
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
    <div className={"min-h-screen m-auto bg-telegram-bg-color"}>
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
