import { Link } from "@/components/i18n/i18n-navigation";
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
        "grid max-w-[59rem] w-full h-[80vh] justify-center items-center mx-auto"
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
              Back to Stores
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
