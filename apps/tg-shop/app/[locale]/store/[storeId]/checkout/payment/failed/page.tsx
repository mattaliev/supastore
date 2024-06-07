import PaymentFailed from "@/components/invoice/payment-failed";

type Props = {
  searchParams: {
    orderId: string;
  };
};

export default async function Failed({
  searchParams
}: Props): Promise<JSX.Element> {
  const orderId = searchParams.orderId;
  //
  // const invoice = await invoiceGetByOrderId(orderId);

  // if (!invoice) {
  //   return notFound();
  // }

  return <PaymentFailed />;
}
