"use client";

import { useUtils } from "@tma.js/sdk-react";

export default function Contact() {
  const utils = useUtils();

  const businessEmail = "contact@ditch-concept.com";
  const businessAddress =
    "PT PMA ALIEN UNDERGROUND ORGANISATION, Jl. Bypass Ngurah Rai No.888 xx, " +
    "Desa/Kelurahan Pemogan, Kec. Denpasar Selatan, Kota Denpasar, Provinsi " +
    "Bali 80221, Indonesia";

  const openSupportBot = () => {
    utils.openTelegramLink("https://t.me/ditch_support_bot");
  };

  return (
    <div className="text-telegram-text-color mx-6">
      <h1 className="text-2xl font-semibold leading-none tracking-tight text-telegram-text-color mb-2">
        Contact Us
      </h1>
      <p className="text-sm mt-5">
        Thank you for reaching out to us! We value your feedback and inquiries.
        Please feel free to contact us through any of the following channels:
        <br />
        <br />
        <span className="font-bold text-base">Email:</span>
        <br />
        <br />
        You can reach us via email at{" "}
        <span className="underline">{businessEmail}</span>. Our dedicated
        support team will get back to you as soon as possible.
        <br />
        <br />
        <span className="font-bold text-base">Telegram Support Bot:</span>
        <br />
        <br />
        Alternatively, you can chat with our{" "}
        <span className="underline cursor-pointer" onClick={openSupportBot}>
          Telegram support bot
        </span>
        . Our bot is available 24/7 to assist you with any questions or concerns
        you may have regarding our products or services.
        <br />
        <br />
        <span className="font-bold text-base">Business Information:</span>
        <br />
        <br />
        {businessAddress}
      </p>
    </div>
  );
}
