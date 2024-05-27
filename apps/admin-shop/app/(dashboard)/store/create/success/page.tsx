import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default function StoreApplicationSuccess() {
  return (
    <div
      className={
        "grid max-w-[59rem] w-full h-[80vh] justify-center items-center"
      }
    >
      <Card className={"m-4"}>
        <CardHeader>
          <CardTitle>Store Application Have Been Submitted!</CardTitle>
          <CardDescription>
            Please wait for one of our team members to approve it. We will
            notify you once it's done.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href={"/store"} className={"w-full"}>
            <Button size={"sm"} className={"w-full"}>
              Back to Store
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
