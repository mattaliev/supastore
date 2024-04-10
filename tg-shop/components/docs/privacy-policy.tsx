"use client";
import { useUtils } from "@tma.js/sdk-react";
import Link from "next/link";

export default function PrivacyPolicy() {
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
    <div id="privacy-policy">
      This Privacy Policy describes how DITCH (the "
      <span className="font-bold">Site</span>", "
      <span className="font-bold">we</span>", "
      <span className="font-bold">us</span>", or "
      <span className="font-bold">our</span>") collects, uses, and discloses
      your personal information when you visit, use our services, or make a
      purchase from @ditch_store_bot (the "
      <span className="font-bold">Application</span>") or otherwise communicate
      with us (collectively, the "<span className="font-bold">Services</span>").
      For purposes of this Privacy Policy, "
      <span className="font-bold">you</span>" and "
      <span className="font-bold">your</span>" means you as the user of the
      Services, whether you are a customer, website visitor, or another
      individual whose information we have collected pursuant to this Privacy
      Policy. Please read this Privacy Policy carefully. By using and accessing
      any of the Services, you agree to the collection, use, and disclosure of
      your information as described in this Privacy Policy. If you do not agree
      to this Privacy Policy, please do not use or access any of the Services.
      <br />
      <br />
      <h1 className="font-bold text-base">Changes to This Privacy Policy</h1>
      <br />
      We may update this Privacy Policy from time to time, including to reflect
      changes to our practices or for other operational, legal, or regulatory
      reasons. We will post the revised Privacy Policy on the Site, update the
      "Last updated" date and take any other steps required by applicable law.
      <br />
      <br />
      <h1 className="font-bold text-base">
        How We Collect and Use Your Personal
      </h1>
      <br />
      Information To provide the Services, we collect and have collected over
      the past 12 months personal information about you from a variety of
      sources, as set out below. The information that we collect and use varies
      depending on how you interact with us. In addition to the specific uses
      set out below, we may use information we collect about you to communicate
      with you, provide the Services, comply with any applicable legal
      obligations, enforce any applicable terms of service, and to protect or
      defend the Services, our rights, and the rights of our users or others.
      <br />
      <br />
      <h1 className="font-bold text-sm">
        What Personal Information We Collect
      </h1>
      <br />
      The types of personal information we obtain about you depends on how you
      interact with our Site and use our Services. When we use the term
      "personal information", we are referring to information that identifies,
      relates to, describes or can be associated with you. The following
      sections describe the categories and specific types of personal
      information we collect.
      <br />
      <br />
      <h1 className="font-bold text-sm">
        Information We Collect Directly from You
      </h1>
      <br />
      Information that you directly submit to us through our Services may
      include:
      <br />
      <br />
      <ul className="list-disc ml-8 list-outside">
        <li>
          <span className="font-bold">Basic contact details</span> including
          your name, address, phone number, email.
        </li>
        <li>
          <span className="font-bold">Order information</span> including your
          name, billing address, shipping address, payment confirmation, email
          address, phone number.
        </li>
        <li>
          <span className="font-bold">Account information</span> including your
          username, password, security questions.
        </li>
        <li>
          <span className="font-bold">Shopping information</span> including the
          items you view, put in your cart or add to your wishlist.
        </li>
        <li>
          <span className="font-bold">Customer support information</span>{" "}
          including the information you choose to include in communications with
          us, for example, when sending a message through the Services.
        </li>
      </ul>
      <br />
      Some features of the Services may require you to directly provide us with
      certain information about yourself. You may elect not to provide this
      information, but doing so may prevent you from using or accessing these
      features.
      <br />
      <br />
      <h1 className="font-bold text-sm">
        Information We Collect through Cookies
      </h1>
      <br />
      We also automatically collect certain information about your interaction
      with the Services ("
      <span className="font-bold">Usage Data</span>"). To do this, we may use
      cookies, pixels and similar technologies ("
      <span className="font-bold">Cookies</span>"). Usage Data may include
      information about how you access and use our Site and your account,
      including device information, browser information, information about your
      network connection, your IP address and other information regarding your
      interaction with the Services.
      <br />
      <br />
      <h1 className="font-bold text-sm">
        Information We Obtain from Third Parties
      </h1>
      <br />
      Finally, we may obtain information about you from third parties, including
      from vendors and service providers who may collect information on our
      behalf, such as:
      <br />
      <br />
      <ul className="list-disc list-outside ml-8">
        <li>Companies who support our Site and Services, such as Telegram.</li>
        <li>
          Our payment processors, who collect payment information (e.g., bank
          account, credit or debit card information, billing address) to process
          your payment in order to fulfill your orders and provide you with
          products or services you have requested, in order to perform our
          contract with you.
        </li>
        <li>
          When you visit our Site, open or click on emails we send you, or
          interact with our Services or advertisements, we, or third parties we
          work with, may automatically collect certain information using online
          tracking technologies such as pixels, web beacons, software developer
          kits, third-party libraries, and cookies.
        </li>
      </ul>
      <br />
      Any information we obtain from third parties will be treated in accordance
      with this Privacy Policy. We are not responsible or liable for the
      accuracy of the information provided to us by third parties and are not
      responsible for any third party's policies or practices. For more
      information, see the section below, Third Party Websites and Links.
      <br />
      <br />
      <h1 className="font-bold text-sm">
        How We Use Your Personal Information
      </h1>
      <br />
      <ul className="list-disc list-outside ml-8">
        <li>
          <span className="font-bold">Providing Products and Services.</span> We
          use your personal information to provide you with the Services in
          order to perform our contract with you, including to process your
          payments, fulfill your orders, to send notifications to you related to
          you account, purchases, returns, exchanges or other transactions, to
          create, maintain and otherwise manage your account, to arrange for
          shipping, facilitate any returns and exchanges and to enable you to
          post reviews.
        </li>
        <li>
          <span className="font-bold">Marketing and Advertising.</span> We use
          your personal information for marketing and promotional purposes, such
          as to send marketing, advertising and promotional communications by
          email, text message or postal mail, and to show you advertisements for
          products or services. This may include using your personal information
          to better tailor the Services and advertising on our Site and other
          websites.
        </li>
        <li>
          <span className="font-bold">Security and Fraud Prevention.</span> We
          use your personal information to detect, investigate or take action
          regarding possible fraudulent, illegal or malicious activity. If you
          choose to use the Services and register an account, you are
          responsible for keeping your account credentials safe. We highly
          recommend that you do not share your username, password, or other
          access details with anyone else. If you believe your account has been
          compromised, please contact us immediately.
        </li>
        <li>
          <span className="font-bold">Communicating with you.</span> We use your
          personal information to provide you with customer support and improve
          our Services. This is in our legitimate interests in order to be
          responsive to you, to provide effective services to you, and to
          maintain our business relationship with you.
        </li>
      </ul>
      <br />
      <h1 className="font-bold text-base">Cookies</h1>
      <br />
      Like many websites, we use Cookies on our Site. We use Cookies to power
      and improve our Site and our Services (including to remember your actions
      and preferences), to run analytics and better understand user interaction
      with the Services (in our legitimate interests to administer, improve and
      optimize the Services). We may also permit third parties and services
      providers to use Cookies on our Site to better tailor the services,
      products and advertising on our Site and other websites. Most browsers
      automatically accept Cookies by default, but you can choose to set your
      browser to remove or reject Cookies through your browser controls. Please
      keep in mind that removing or blocking Cookies can negatively impact your
      user experience and may cause some of the Services, including certain
      features and general functionality, to work incorrectly or no longer be
      available. Additionally, blocking Cookies may not completely prevent how
      we share information with third parties such as our advertising partners.
      <br />
      <br />
      <h1 className="font-bold text-base">
        How We Disclose Personal Information
      </h1>
      <br />
      In certain circumstances, we may disclose your personal information to
      third parties for legitimate purposes subject to this Privacy Policy. Such
      circumstances may include:
      <br />
      <ul className="list-disc list-outside ml-8">
        <li>
          With vendors or other third parties who perform services on our behalf
          (e.g., IT management, payment processing, data analytics, customer
          support, cloud storage, fulfillment and shipping).
        </li>
        <li>
          With business and marketing partners to provide services and advertise
          to you. Our business and marketing partners will use your information
          in accordance with their own privacy notices.
        </li>
        <li>
          When you direct, request us or otherwise consent to our disclosure of
          certain information to third parties, such as to ship you products or
          through your use of social media widgets or login integrations, with
          your consent.
        </li>
        <li>
          With our affiliates or otherwise within our corporate group, in our
          legitimate interests to run a successful business.
        </li>
        <li>
          In connection with a business transaction such as a merger or
          bankruptcy, to comply with any applicable legal obligations (including
          to respond to subpoenas, search warrants and similar requests), to
          enforce any applicable terms of service, and to protect or defend the
          Services, our rights, and the rights of our users or others.
        </li>
      </ul>
      <br />
      We have, in the past 12 months disclosed the following categories of
      personal information and sensitive personal information (denoted by *)
      about users for the purposes set out above in{" "}
      <span className="italic">
        "How we Collect and Use your Personal Information"
      </span>{" "}
      and <span className="italic">"How we Disclose Personal Information"</span>
      :
      <table className="table-fixed my-4">
        <thead>
          <tr>
            <th className="border border-telegram-hint-color">Category</th>
            <th className="border border-telegram-hint-color">
              Categories of Recipients
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-telegram-hint-color">
              <ul className="list-outside list-disc ml-6">
                <li>
                  Identifiers such as basic contact details and certain order
                  and account information
                </li>
                <li>
                  Commercial information such as order information, shopping
                  information and customer support information
                </li>
                <li>
                  Internet or other similar network activity, such as Usage Data
                </li>
              </ul>
            </td>
            <td className="border border-telegram-hint-color">
              <ul className="list-disc list-outside ml-6">
                <li>
                  Vendors and third parties who perform services on our behalf
                  (such as Internet service providers, payment processors,
                  fulfillment partners, customer support partners and data
                  analytics providers)
                </li>
                <li>Business and marketing partners</li>
                <li>Affiliates</li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
      We do not use or disclose sensitive personal information for the purposes
      of inferring characteristics about you.
      <br />
      <br />
      <h1 className="font-bold text-base">User Generated Content</h1>
      <br />
      The Services may enable you to post product reviews and other
      user-generated content. If you choose to submit user generated content to
      any public area of the Services, this content will be public and
      accessible by anyone. <br /> <br /> We do not control who will have access
      to the information that you choose to make available to others, and cannot
      ensure that parties who have access to such information will respect your
      privacy or keep it secure. We are not responsible for the privacy or
      security of any information that you make publicly available, or for the
      accuracy, use or misuse of any information that you disclose or receive
      from third parties.
      <br />
      <br />
      <h1 className="font-bold text-base">Third Party Websites and Links</h1>
      <br />
      Our Site may provide links to websites or other online platforms operated
      by third parties. If you follow links to sites not affiliated or
      controlled by us, you should review their privacy and security policies
      and other terms and conditions. We do not guarantee and are not
      responsible for the privacy or security of such sites, including the
      accuracy, completeness, or reliability of information found on these
      sites. Information you provide on public or semi-public venues, including
      information you share on third-party social networking platforms may also
      be viewable by other users of the Services and/or users of those
      third-party platforms without limitation as to its use by us or by a third
      party. Our inclusion of such links does not, by itself, imply any
      endorsement of the content on such platforms or of their owners or
      operators, except as disclosed on the Services.
      <br />
      <br />
      <h1 className="font-bold text-base">Children&apos;s Data</h1>
      <br />
      The Services are not intended to be used by children, and we do not
      knowingly collect any personal information about children. If you are the
      parent or guardian of a child who has provided us with their personal
      information, you may contact us using the contact details set out below to
      request that it be deleted. As of the Effective Date of this Privacy
      Policy, we do not have actual knowledge that we “share” or “sell” (as
      those terms are defined in applicable law) personal information of
      individuals under 16 years of age.
      <br />
      <br />
      <h1 className="font-bold text-base">
        Security and Retention of Your Information
      </h1>
      <br />
      Please be aware that no security measures are perfect or impenetrable, and
      we cannot guarantee “perfect security.” In addition, any information you
      send to us may not be secure while in transit. We recommend that you do
      not use unsecure channels to communicate sensitive or confidential
      information to us. How long we retain your personal information depends on
      different factors, such as whether we need the information to maintain
      your account, to provide the Services, comply with legal obligations,
      resolve disputes or enforce other applicable contracts and policies.
      <br />
      <br />
      <h1 className="font-bold text-base">Your Rights and Choices</h1>
      <br />
      Depending on where you live, you may have some or all of the rights listed
      below in relation to your personal information. However, these rights are
      not absolute, may apply only in certain circumstances and, in certain
      cases, we may decline your request as permitted by law.
      <br />
      <ul className="list-disc list-outside ml-8">
        <li>
          <span className="font-bold">Right to Access / Know.</span> You may
          have a right to request access to personal information that we hold
          about you, including details relating to the ways in which we use and
          share your information.
        </li>
        <li>
          <span className="font-bold">Right to Delete.</span> You may have a
          right to request that we delete personal information we maintain about
          you.
        </li>
        <li>
          <span className="font-bold">Right to Correct.</span> You may have a
          right to request that we correct inaccurate personal information we
          maintain about you.
        </li>
        <li>
          <span className="font-bold">Right of Portability.</span> You may have
          a right to receive a copy of the personal information we hold about
          you and to request that we transfer it to a third party, in certain
          circumstances and with certain exceptions.
        </li>
        <li>
          <span className="font-bold">
            Right to Opt out of Sale or Sharing or Targeted Advertising.
          </span>{" "}
          You may have a right to direct us not to "sell" or "share" your
          personal information or to opt out of the processing of your personal
          information for purposes considered to be "targeted advertising", as
          defined in applicable privacy laws. Please note that if you visit our
          Site with the Global Privacy Control opt-out preference signal
          enabled, depending on where you are, we will automatically treat this
          as a request to opt-out of the "sale" or "sharing" of information for
          the device and browser that you use to visit the Site.
        </li>
        <li>
          <span className="font-bold">
            Right to Limit and/or Opt out of Use and Disclosure of Sensitive
            Personal Information.
          </span>{" "}
          You may have a right to direct us to limit our use and/or disclosure
          of sensitive personal information to only what is necessary to perform
          the Services or provide the goods reasonably expected by an average
          individual.
        </li>
        <li>
          <span className="font-bold">Restriction of Processing:</span> You may
          have the right to ask us to stop or restrict our processing of
          personal information.
        </li>
        <li>
          <span className="font-bold">Withdrawal of Consent:</span> Where we
          rely on consent to process your personal information, you may have the
          right to withdraw this consent.
        </li>
        <li>
          <span className="font-bold">Appeal:</span> You may have a right to
          appeal our decision if we decline to process your request. You can do
          so by replying directly to our denial.
        </li>
        <li>
          <span className="font-bold">Managing Communication Preferences:</span>{" "}
          We may send you promotional emails, and you may opt out of receiving
          these at any time by using the unsubscribe option displayed in our
          emails to you. If you opt out, we may still send you non-promotional
          emails, such as those about your account or orders that you have made.
        </li>
      </ul>
      <br />
      You may exercise any of these rights where indicated on our Site or by
      contacting us using the contact details provided below.
      <br />
      <br />
      We will not discriminate against you for exercising any of these rights.
      We may need to collect information from you to verify your identity, such
      as your email address or account information, before providing a
      substantive response to the request. In accordance with applicable laws,
      You may designate an authorized agent to make requests on your behalf to
      exercise your rights. Before accepting such a request from an agent, we
      will require that the agent provide proof you have authorized them to act
      on your behalf, and we may need you to verify your identity directly with
      us. We will respond to your request in a timely manner as required under
      applicable law.
      <br />
      <br />
      <h1 className="font-bold text-base">Complaints</h1>
      <br />
      If you have complaints about how we process your personal information,
      please contact us using the contact details provided below. If you are not
      satisfied with our response to your complaint, depending on where you live
      you may have the right to appeal our decision by contacting us using the
      contact details set out below, or lodge your complaint with your local
      data protection authority.
      <br />
      <br />
      <h1 className="font-bold text-base">International Users</h1>
      <br />
      Please note that we may transfer, store and process your personal
      information outside the country you live in, including the United States.
      Your personal information is also processed by staff and third party
      service providers and partners in these countries. If we transfer your
      personal information out of Europe, we will rely on recognized transfer
      mechanisms like the European Commission's Standard Contractual Clauses, or
      any equivalent contracts issued by the relevant competent authority of the
      UK, as relevant, unless the data transfer is to a country that has been
      determined to provide an adequate level of protection.
      <br />
      <br />
      <h1 className="font-bold text-base">Contact</h1>
      <br />
      Should you have any questions about our privacy practices or this Privacy
      Policy, or if you would like to exercise any of the rights available to
      you, please use or{" "}
      <span className="underline cursor-pointer" onClick={openSupportBot}>
        Telegram support bot
      </span>{" "}
      or call +62 8196 0722 53 or email us at{" "}
      <span>
        <Link href={"mailto:" + businessEmail} className="underline">
          {businessEmail}
        </Link>
      </span>{" "}
      or contact us at {businessAddress} <br /> <br />
      Last updated: 14/03/2024
    </div>
  );
}
