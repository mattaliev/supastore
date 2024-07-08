"use client";
import { ManualMailing, ManualMailingStatus } from "@ditch/lib";
import { useFormatter, useTranslations } from "next-intl";

import ManualMailingActions from "@/components/marketing/ManualMailingActions";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ManualMailingsList({
  manualMailings,
}: {
  manualMailings?: ManualMailing[];
}) {
  const format = useFormatter();
  const t = useTranslations("MarketingPage.ManualMailingList");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("Table.name")}</TableHead>
              <TableHead className={"hidden sm:table-cell"}>
                {t("Table.sentAt")}
              </TableHead>
              <TableHead>{t("Table.status")}</TableHead>
              <TableHead className={"hidden sm:table-cell"}>
                {t("Table.successful")}
              </TableHead>
              <TableHead className={"hidden md:table-cell"}>
                {t("Table.failed")}
              </TableHead>
              <TableHead>{t("Table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {manualMailings && manualMailings.length > 0 ? (
              manualMailings.map((manualMailing) => (
                <TableRow key={manualMailing.id}>
                  <TableCell>{manualMailing.name}</TableCell>
                  <TableCell className={"hidden sm:table-cell"}>
                    {format.dateTime(new Date(manualMailing.sentAt), {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <MailingStatusBadge status={manualMailing.status} />
                  </TableCell>
                  <TableCell className={"hidden sm:table-cell"}>
                    {manualMailing.successfulSendCount}
                  </TableCell>
                  <TableCell className={"hidden md:table-cell"}>
                    {manualMailing.userCount -
                      manualMailing.successfulSendCount}
                  </TableCell>
                  <TableCell>
                    <ManualMailingActions
                      status={manualMailing.status}
                      mailingId={manualMailing.id}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className={"text-center py-4"}>
                  <p className={"text-muted-foreground font-semibold text-sm"}>
                    {t("Table.noPastMailings")}
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function MailingStatusBadge({ status }: { status: ManualMailingStatus }) {
  const t = useTranslations(
    "MarketingPage.ManualMailingList.MailingStatusBadge",
  );

  if (status === ManualMailingStatus.SENT) {
    return <Badge variant={"default"}>{t("sent")}</Badge>;
  }

  if (status === ManualMailingStatus.DRAFT) {
    return <Badge variant={"outline"}> {t("draft")}</Badge>;
  }

  return <Badge>{status}</Badge>;
}
