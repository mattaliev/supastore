import { Skeleton } from "@ditch/admin-shop/components/ui/skeleton";

export default function LoadingPage() {
  return (
    <div className={"grid gap-6"}>
      <div className={"grid grid-cols-2 gap-6 px-6 py-6"}>
        {Array.from({ length: 4 }).map((_, i) => (
          <CatalogProductSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function CatalogProductSkeleton() {
  return (
    <div className={"grid gap-2 rounded-xl"}>
      <Skeleton
        className={
          "w-full h-48 animate-pulse bg-telegram-hint-color rounded-xl"
        }
      />
      <div className={"p-1 grid gap-1"}>
        <Skeleton
          className={"w-full h-3 animate-pulse bg-telegram-hint-color"}
        />
        <Skeleton
          className={"w-1/2 h-3 animate-pulse bg-telegram-hint-color"}
        />
      </div>
      <div className={"p-1"}>
        <Skeleton
          className={
            "w-full h-9 animate-pulse bg-telegram-hint-color rounded-md"
          }
        />
      </div>
    </div>
  );
}
