import { Card } from "@/components/ui/card";

import defaultDarkImage from "../../../../media/default/default-dark.webp";
import defaultLightImage from "../../../../media/default/default-light.webp";

export function Showcase() {
  return (
    <section aria-label="Studio Admin preview">
      <Card className="rounded-lg py-0" data-landing-dashboard-preview>
        <img
          alt="Studio Admin default dashboard with its layout customization controls open"
          className="h-auto w-full rounded-lg! dark:hidden"
          src={defaultLightImage}
        />
        <img
          alt="Studio Admin default dashboard with its layout customization controls open"
          className="hidden h-auto w-full rounded-lg! dark:block"
          src={defaultDarkImage}
        />
      </Card>
    </section>
  );
}
