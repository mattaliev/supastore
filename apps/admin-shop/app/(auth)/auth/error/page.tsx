import Image from "next/image";

type AuthErrorPageProps = {
  searchParams: {
    error: string;
  };
};

export default function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  if (searchParams.error === "AccessDenied") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-muted/50">
        <div className="max-w-md px-4 space-y-4 text-center">
          <Image
            src={"/tiger.png"}
            alt={"Unauthorized"}
            width={200}
            height={200}
            className={"mx-auto"}
          />
          <h1 className="text-4xl font-bold text-primary">Unauthorized</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
    </div>
  );
}
