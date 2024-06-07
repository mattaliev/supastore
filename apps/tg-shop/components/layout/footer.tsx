import Link from "@/components/navigation/link";

export default function Footer() {
  return (
    <div>
      <div className="flex justify-between items-baseline m-2">
        <div className="flex items-center">
          <p className="text-telegram-hint-color text-xs">© 2024 DITCH</p>
        </div>
        <div className="flex justify-center gap-x-1">
          <p className="text-telegram-hint-color text-xs">
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
            <span> | </span>
          </p>
          <p className="text-telegram-hint-color text-xs">
            <Link href="/policies" className="hover:underline">
              Policies
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
