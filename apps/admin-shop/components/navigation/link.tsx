"use client";

import NextLink from "next/link";
import React, { ComponentProps } from "react";

import { Link as IntlLink } from "@/components/i18n/i18n-navigation";
import { useStore } from "@/components/store/store-context";

type Props = ComponentProps<typeof IntlLink> & {
  localized?: boolean;
  inStore?: boolean;
};

function Link(
  { href, localized = true, inStore = true, ...props }: Props,
  ref: Props["ref"]
) {
  const storeId = inStore ? useStore() : undefined;

  if (localized) {
    return (
      <IntlLink href={storeId ? `/store/${storeId}${href}` : href} {...props} />
    );
  }
  return (
    <NextLink href={storeId ? `/store/${storeId}${href}` : href} {...props} />
  );
}

const LinkWithRef = React.forwardRef(Link);
LinkWithRef.displayName = "Link";

export default LinkWithRef;
