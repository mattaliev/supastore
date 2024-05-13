"use client";
import { Order } from "@ditch/lib";
import { useUtils } from "@tma.js/sdk-react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { Button } from "@/components/ui/button";

export default function USPaymentOption({
  order
}: {
  order: Order;
}): JSX.Element {
  const [copied, setCopied] = useState(false);

  const utils = useUtils();
  const openSupportBot = () => {
    utils.openTelegramLink("https://t.me/ditch_support_bot");
  };

  const copyIconClasses =
    "text-telegram-text-color w-4 h-4 hover:text-telegram-button-color";
  const checkIconClasses = "text-telegram-button-color w-4 h-4";

  return (
    <div className="text-telegram-text-color text-sm">
      <strong>Notice for US Customers:</strong> We're currently unable to
      process payments in the US through this bot, but are working to resolve
      this. In the meantime, you can copy your order ID and send it to our
      support chat, and we'll help you complete your order.
      <br />
      <div className="flex items-center gap-2 mt-2 pr-4">
        <div className="bg-gray-500 p-2 rounded-md text-xs">{order.id}</div>
        <CopyToClipboard text={order.id} onCopy={() => setCopied(true)}>
          {copied ? (
            <CheckIcon className={checkIconClasses} />
          ) : (
            <CopyIcon className={copyIconClasses} />
          )}
        </CopyToClipboard>
      </div>
      <Button
        className="mt-4 w-full bg-telegram-button-color text-telegram-text-color hover:bg-telegram-button-color border-none border-telegram-text-color hover:text-telegram-button-text-color hover:border-none"
        onClick={openSupportBot}
      >
        Contact Support
      </Button>
    </div>
  );
}
