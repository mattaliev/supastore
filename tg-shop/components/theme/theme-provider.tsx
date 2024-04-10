"use client";

import { useMiniApp } from "@tma.js/sdk-react";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const miniApp = useMiniApp();

  miniApp.setHeaderColor(miniApp.backgroundColor);
  miniApp.setBackgroundColor(miniApp.backgroundColor);

  return <>{children}</>;
}

const order = [
  {
    eventId: 9824955563010,
    eventDateTime: "2024-03-07T04:45:32.668585Z",
    payload: {
      id: 9824943534337,
      number: "9PCFI4MC",
      externalId: "9e162604-614c-414f-9123-11a978648cb7",
      orderAmount: { amount: "0.10", currencyCode: "USD" },
      selectedPaymentOption: {
        amount: { amount: "0.099970", currencyCode: "USDT" },
        amountFee: { amount: "0.001999", currencyCode: "USDT" },
        amountNet: { amount: "0.097971", currencyCode: "USDT" },
        exchangeRate: "0.9997043767358056",
      },
      orderCompletedDateTime: "2024-03-07T04:45:32.668462Z",
    },
    type: "ORDER_PAID",
  },
];
