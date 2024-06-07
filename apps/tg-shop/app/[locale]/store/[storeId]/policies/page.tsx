import DeliveryPolicy from "@/components/docs/delivery-policy";
import PrivacyPolicy from "@/components/docs/privacy-policy";
import ReturnPolicy from "@/components/docs/return-policy";
import TermsOfService from "@/components/docs/terms-of-service";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

export default function Policies() {
  return (
    <div className="text-telegram-text-color mx-6">
      <h1 className="text-2xl font-semibold leading-none tracking-tight text-telegram-text-color mb-2">
        Policies
      </h1>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="terms">
          <AccordionTrigger>Terms of Service</AccordionTrigger>
          <AccordionContent>
            <TermsOfService />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="privacy">
          <AccordionTrigger>Privacy Policy</AccordionTrigger>
          <AccordionContent>
            <PrivacyPolicy />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="refund">
          <AccordionTrigger>Return Policy</AccordionTrigger>
          <AccordionContent>
            <ReturnPolicy />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="deliver">
          <AccordionTrigger>Delivery Policy</AccordionTrigger>
          <AccordionContent>
            <DeliveryPolicy />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
