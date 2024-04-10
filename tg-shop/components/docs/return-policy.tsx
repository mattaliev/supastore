"use client";
import { useUtils } from "@tma.js/sdk-react";
import Link from "next/link";

export default function ReturnPolicy() {
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
    <div>
      We have a 30-day return policy, which means you have 30 days after
      receiving your item to request a return.
      <br />
      <br />
      To be eligible for a return, your item must be in the same condition that
      you received it, unworn or unused, with tags, and in its original
      packaging. You’ll also need the receipt or proof of purchase.
      <br />
      <br />
      To start a return, you can contact us through our{" "}
      <span className="underline" onClick={openSupportBot}>
        Telegram Support Bot
      </span>{" "}
      or mail us at{" "}
      <span>
        <Link href={"mailto:" + businessEmail} className="underline">
          {businessEmail}
        </Link>
      </span>
      {". "}
      Please note that returns will need to be sent to the following address Jl.
      Tegal Cupek I No.73, Kerobokan, Kec. Kuta Utara, Kabupaten Badung, Bali
      80361, Indonesia.
      <br />
      <br />
      If your return is accepted, we’ll send you a return shipping label, as
      well as instructions on how and where to send your package. Items sent
      back to us without first requesting a return will not be accepted.
      <br />
      <br />
      You can always contact us for any return question at our{" "}
      <span className={"underline"} onClick={openSupportBot}>
        Telegram Support Bot
      </span>{" "}
      or{" "}
      <span>
        <Link href={"mailto:" + businessEmail} className="underline">
          {businessEmail}
        </Link>
      </span>
      .
      <br />
      <br />
      <h1 className="text-base font-semibold">Damages and issues</h1>
      <br />
      Please inspect your order upon reception and contact us immediately if the
      item is defective, damaged or if you receive the wrong item, so that we
      can evaluate the issue and make it right.
      <br />
      <br />
      <h1 className="text-base font-semibold">
        Exceptions / non-returnable items
      </h1>
      <br />
      Certain types of items cannot be returned, like perishable goods (such as
      food, flowers, or plants), custom products (such as special orders or
      personalized items), and personal care goods (such as beauty products). We
      also do not accept returns for hazardous materials, flammable liquids, or
      gases. Please get in touch if you have questions or concerns about your
      specific item.
      <br />
      <br />
      Unfortunately, we cannot accept returns on sale items or gift cards.
      <br />
      <br />
      <h1 className="text-base font-semibold">Exchanges</h1>
      <br />
      The fastest way to ensure you get what you want is to return the item you
      have, and once the return is accepted, make a separate purchase for the
      new item.
      <br />
      <br />
      <h1 className="text-base font-semibold">Refunds</h1>
      <br />
      We will notify you once we’ve received and inspected your return, and let
      you know if the refund was approved or not. If approved, you’ll be
      automatically refunded on your original payment method within 10 business
      days. Please remember it can take some time for your bank or credit card
      company to process and post the refund too.
      <br />
      <br />
      If more than 15 business days have passed since we’ve approved your
      return, please contact us in our{" "}
      <span className={"underline"} onClick={openSupportBot}>
        Telegram Support Bot
      </span>{" "}
      or{" "}
      <span>
        <Link href={"mailto:" + businessEmail} className="underline">
          {businessEmail}
        </Link>
      </span>
    </div>
  );
}
