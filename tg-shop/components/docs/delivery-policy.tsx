"use client";
import { useUtils } from "@tma.js/sdk-react";

export default function DeliveryPolicy() {
  const utils = useUtils();

  const openSupportBot = () => {
    utils.openTelegramLink("https://t.me/ditch_support_bot");
  };

  return (
    <div>
      <h2 className="text-base font-bold">Global Delivery</h2>
      <br />
      <ul className="list-outside list-disc px-4">
        <li>
          <strong>Coverage</strong>: We are proud to offer worldwide delivery.
          Regardless of where you are, you can enjoy our wide range of products
          delivered directly to your doorstep.
        </li>
        <li>
          <strong>Delivery Time</strong>: Our standard delivery timeframe for
          international orders is up to 14 days from the date of purchase. While
          we strive to deliver your order as quickly as possible, please note
          that delivery times may vary due to factors beyond our control, such
          as customs delays or carrier issues.
        </li>
        <li>
          <strong>Cost</strong>: A flat rate of $20 USD is charged for
          international shipping. This cost is added to your order at checkout.
          The shipping fee covers handling, packing, and delivery of your order.
        </li>
        <li>
          <strong>Tracking</strong>: Once your order is dispatched, you will
          receive a tracking number via email. This allows you to monitor the
          progress of your shipment directly on the carrier's website.
        </li>
      </ul>
      <br />

      <h2 className="text-base font-bold">Delivery to Bali</h2>
      <br />
      <ul className="list-outside list-disc px-4">
        <li>
          <strong>Free Delivery</strong>: As a special offer to our customers in
          Bali, we provide free delivery on all orders, regardless of the
          purchase value. This is our way of saying thank you for your continued
          support.
        </li>
        <li>
          <strong>Delivery Time</strong>: Orders placed within Bali are also
          subject to our up to 14-day delivery policy. However, we often find
          that deliveries within Bali are completed more quickly, thanks to our
          local logistics partners.
        </li>
        <li>
          <strong>Order Processing</strong>: Orders for Bali residents are
          processed with the same care and speed as all our orders. You can
          expect your items to be dispatched promptly.
        </li>
      </ul>
      <br />
      <h2 className="text-base font-bold">General Information</h2>
      <br />
      <ul className="list-outside list-disc px-4">
        <li>
          <strong>Order Processing</strong>: Orders are processed on business
          days (Monday through Friday, excluding public holidays). Orders placed
          on weekends or public holidays will be processed the next business
          day.
        </li>
        <li>
          <strong>Packaging</strong>: We take great care in packaging your items
          to ensure they arrive in perfect condition. If you have special
          packaging requests or need additional protection for fragile items,
          please contact us immediately after placing your order.
        </li>
        <li>
          <strong>Customer Service</strong>: If you have any questions or
          concerns about your order, our customer service team is here to help.
          You can reach us via our{" "}
          <span className="underline" onClick={openSupportBot}>
            Telegram Support Bot
          </span>{" "}
          or via <span className="underline">contact@ditch-concept.com</span>.
        </li>
      </ul>
    </div>
  );
}
