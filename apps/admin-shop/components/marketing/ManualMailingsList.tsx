"use client";
import { ManualMailing, ManualMailingStatus } from "@ditch/lib";
import { useFormatter } from "next-intl";

import ManualMailingActions from "@/components/marketing/ManualMailingActions";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export default function ManualMailingsList({
  manualMailings
}: {
  manualMailings?: ManualMailing[];
}) {
  const format = useFormatter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Past Campaigns</CardTitle>
        <CardDescription>
          Analyse your past campaigns to see how your customers are responding
          to your in-app messages.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className={"hidden sm:table-cell"}>Sent At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className={"hidden sm:table-cell"}>
                Successful
              </TableHead>
              <TableHead className={"hidden md:table-cell"}>Failed</TableHead>
              <TableHead>Actions</TableHead>
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
                      minute: "numeric"
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
                  {/*<TableCell className="text-muted-foreground">*/}
                  {/*  {manualMailing.status === "SENT" ? "Send" : "View"}*/}
                  {/*</TableCell>*/}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className={"text-center py-4"}>
                  <p className={"text-muted-foreground font-semibold text-sm"}>
                    No past mailings
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
  if (status === ManualMailingStatus.SENT) {
    return <Badge variant={"default"}>Sent</Badge>;
  }

  if (status === ManualMailingStatus.DRAFT) {
    return <Badge variant={"outline"}>Draft</Badge>;
  }

  return <Badge>{status}</Badge>;
}
