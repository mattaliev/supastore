import { getTranslations } from "next-intl/server";

import Link from "@/components/navigation/link";

export default async function Footer() {
  const t = await getTranslations("Footer");
  return (
    <div>
      <div className="flex justify-between items-baseline m-2">
        <div className="flex items-center">
          <p className="text-telegram-hint-color text-xs">© 2024 Supastore</p>
        </div>
        <div className="flex justify-center gap-x-1">
          <p className="text-telegram-hint-color text-xs">
            <Link href="/contact" className="hover:underline">
              {t("contact")}
            </Link>
            <span> | </span>
          </p>
          <p className="text-telegram-hint-color text-xs">
            <Link href="/policies" className="hover:underline">
              {t("policies")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
