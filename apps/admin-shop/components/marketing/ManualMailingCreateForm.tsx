import { ManualMailingPreviewInput } from "@ditch/lib";
import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ManualMailingCreateForm({
  campaign,
  setCampaign,
}: {
  campaign: Partial<ManualMailingPreviewInput>;
  setCampaign: (campaign: Partial<ManualMailingPreviewInput>) => void;
}) {
  return (
    <form className={"grid gap-4"}>
      <input type={"hidden"} name={"store-id"} value={"123"} />
      <div className={"grid gap-2"}>
        <Label htmlFor={"name"}>Name</Label>
        <Input
          type={"text"}
          id={"name"}
          name={"name"}
          placeholder={"Enter campaign name"}
        />
      </div>
      <div className={"grid gap-2"}>
        <Label htmlFor={"message"}>Message</Label>
        <Textarea
          id={"message"}
          name={"message"}
          className={"h-36"}
          onChange={(e) =>
            setCampaign({ ...campaign, message: e.target.value })
          }
          placeholder={"Enter message content \n\nNote: You can use Markdown."}
        />
      </div>
      <div className={"grid gap-2"}>
        <Label htmlFor={"audience"}>Audience</Label>
        <p className={"text-muted-foreground text-sm"}>
          Select the audience for this campaign.
        </p>
        <div className={"grid gap-1"}>
          <div className={"flex items-center gap-2"}>
            <Checkbox id={"all"} name={"audience"} value={"ALL"} />
            <Label className={"text-sm text-muted-foreground"} htmlFor={"all"}>
              All
            </Label>
          </div>
          <div className={"flex items-center gap-2"}>
            <Checkbox id={"new"} name={"audience"} value={"NEW"} />
            <Label htmlFor={"new"} className={"text-sm text-muted-foreground"}>
              New
            </Label>
          </div>
          <div className={"flex items-center gap-2"}>
            <Checkbox
              id={"added-to-cart"}
              name={"audience"}
              value={"ADDED_TO_CART"}
            />
            <Label
              htmlFor={"added-to-cart"}
              className={"text-sm text-muted-foreground"}
            >
              Added to cart
            </Label>
          </div>
          <div className={"flex items-center gap-2"}>
            <Checkbox
              id={"started-checkout"}
              name={"audience"}
              value={"STARTED_CHECKOUT"}
            />
            <Label
              htmlFor={"started-checkout"}
              className={"text-sm text-muted-foreground"}
            >
              Started checkout
            </Label>
          </div>
          <div className={"flex items-center gap-2"}>
            <Checkbox id={"purchased"} name={"audience"} value={"PURCHASED"} />
            <Label
              htmlFor={"purchased"}
              className={"text-sm text-muted-foreground"}
            >
              Purchased
            </Label>
          </div>
        </div>
      </div>
      <div className={"grid gap-2"}>
        <Label htmlFor={"cta-text"}>Call-to-Action Text</Label>
        <Input
          type={"text"}
          id={"cta-text"}
          name={"cta-text"}
          onChange={(e) =>
            setCampaign({ ...campaign, ctaText: e.target.value })
          }
          placeholder={"Enter Call-to-Action text"}
        />
      </div>
      <div className={"grid gap-2"}>
        <Label htmlFor={"cta-url"}>Call-to-Action URL</Label>
        <Input
          type={"text"}
          id={"cta-url"}
          name={"cta-url"}
          onChange={(e) => setCampaign({ ...campaign, ctaUrl: e.target.value })}
          placeholder={"Enter Call-to-Action URL"}
        />
      </div>
      <div className={"grid gap-2"}>
        <Label htmlFor={"execute-immediately"}>Execute Immediately</Label>
        <div className={"flex items-center gap-2"}>
          <Checkbox
            id={"execute-immediately"}
            name={"execute-immediately"}
            defaultChecked={false}
          />
          <Label
            className={"text-muted-foreground text-sm"}
            htmlFor={"execute-immediately"}
          >
            Send the campaign <span className={"font-bold"}>immediately</span>{" "}
            after creation
          </Label>
        </div>
      </div>
      <div className={"grid gap-2"}>
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <Button
        className={"w-full flex items-center gap-2"}
        disabled
        type={"submit"}
      >
        <LoaderCircle className={"animate-spin"} />
        Creating Campaign...
      </Button>
    );
  }

  return (
    <Button className={"w-full"} type={"submit"}>
      Create Campaign
    </Button>
  );
}
