"use client";
import { Store } from "@ditch/lib";

import StoreBotToken from "@/components/store/store-bot-token";
import StoreInformation from "@/components/store/store-information";
import StoreLogo from "@/components/store/store-logo";

export default function StoreUpdateForm({
  store,
  botToken,
}: {
  store: Store;
  botToken?: string | null;
}) {
  return (
    <div className="grid gap-3 w-full max-w-[59rem] mx-auto">
      <input type="hidden" name="store-id" value={store.id} />
      <StoreInformation store={store} />
      <StoreLogo store={store} />
      <StoreBotToken store={store} botToken={botToken} />
    </div>
  );
}
