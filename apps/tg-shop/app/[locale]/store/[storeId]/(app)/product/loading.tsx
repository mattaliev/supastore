import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoadingPage() {
  return (
    <div className={"p-4"}>
      <div className={"grid gap-6"}>
        <Skeleton className={"h-96 w-full rounded-lg animate-pulse"} />
        <div className={"grid gap-2"}>
          <Skeleton className={"h-6 w-1/2 animate-pulse"} />
          <div className={"grid gap-1"}>
            <Skeleton className={"h-4 w-full animate-pulse"} />
            <Skeleton className={"h-4 w-5/6 animate-pulse"} />
            <Skeleton className={"h-4 w-1/2 animate-pulse"} />
          </div>
          <Skeleton className={"h-11 w-full rounded-md animate-pulse"} />
        </div>
      </div>
    </div>
  );
}
