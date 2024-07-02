import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoadingPage() {
  return (
    <div className={"grid gap-6 p-6"}>
      <Skeleton className={"h-4 w-2/3 mx-auto"} />
      <div className={"flex items-start justify-between gap-4"}>
        <Skeleton
          className={"w-[140px] aspect-square rounded-lg animate-pulse"}
        />
        <div className={"grid gap-2"}>
          <div className={"grid gap-1"}>
            <Skeleton className={"h-4 w-full animate-pulse"} />
            <Skeleton className={"h-4 w-1/2 animate-pulse"} />
          </div>
          <Skeleton className={"h-3 w-1/2 animate-pulse"} />
          <Skeleton className={"h-4 w-1/3 animate-pulse"} />
        </div>
      </div>
      <div className={"grid gap-4"}>
        <Skeleton className={"h-4 w-1/3 animate-pulse"} />
        <div className={"grid gap-1"}>
          <Skeleton className={"h-3 w-full animate-pulse"} />
          <Skeleton className={"h-3 w-5/6 animate-pulse"} />
          <Skeleton className={"h-3 w-1/2 animate-pulse"} />
        </div>
      </div>
      <div className={"grid gap-4"}>
        <Skeleton className={"h-4 w-1/3 animate-pulse"} />
        <div className={"grid gap-1"}>
          <Skeleton className={"h-3 w-1/4 animate-pulse"} />
          <Skeleton className={"h-3 w-1/3 animate-pulse"} />
          <Skeleton className={"h-3 w-1/3 animate-pulse"} />
        </div>
      </div>
      <Skeleton className={"h-11 w-full rounded-md animate-pulse"} />
    </div>
  );
}
